if not lib then return end

local Items = require 'modules.items.server'
local Inventory = require 'modules.inventory.server'
local Shops = {}
local locations = shared.target and 'targets' or 'locations'

---@class OxShopItem
---@field slot number
---@field weight number

local function setupShopItems(id, shopType, shopName, groups)
	local shop = id and Shops[shopType][id] or Shops[shopType] --[[@as OxShop]]

	for i = 1, shop.slots do
		local slot = shop.items[i]

		if slot.grade and not groups then
			print(('^1attempted to restrict slot %s (%s) to grade %s, but %s has no job restriction^0'):format(id, slot.name, json.encode(slot.grade), shopName))
			slot.grade = nil
		end

		local Item = Items(slot.name)

		if Item then
			---@type OxShopItem
			slot = {
				name = Item.name,
				slot = i,
				weight = Item.weight,
				count = slot.count,
				price = (server.randomprices and (not slot.currency or slot.currency == 'money')) and (math.ceil(slot.price * (math.random(80, 120)/100))) or slot.price or 0,
				metadata = slot.metadata,
				license = slot.license,
				currency = slot.currency,
				grade = slot.grade
			}

			if slot.metadata then
				slot.weight = Inventory.SlotWeight(Item, slot, true)
			end

			shop.items[i] = slot
		end
	end
end

---@param shopType string
---@param properties OxShop
local function registerShopType(shopType, properties)
	local shopLocations = properties[locations] or properties.locations

	if shopLocations then
		Shops[shopType] = properties
	else
		Shops[shopType] = {
			label = properties.name,
			id = shopType,
			groups = properties.groups or properties.jobs,
			items = properties.inventory,
			slots = #properties.inventory,
			type = 'shop',
		}

		setupShopItems(nil, shopType, properties.name, properties.groups or properties.jobs)
	end
end

---@param shopType string
---@param id number
local function createShop(shopType, id)
	local shop = Shops[shopType]

	if not shop then return end

	local store = (shop[locations] or shop.locations)?[id]

	if not store then return end

	local groups = shop.groups or shop.jobs
    local coords

    if shared.target then
        if store.length then
            local z = store.loc.z + math.abs(store.minZ - store.maxZ) / 2
            coords = vec3(store.loc.x, store.loc.y, z)
        else
            coords = store.coords or store.loc
        end
    else
        coords = store
    end

	shop[id] = {
		label = shop.name,
		id = shopType..' '..id,
		groups = groups,
		items = table.clone(shop.inventory),
		slots = #shop.inventory,
		type = 'shop',
		coords = coords,
		distance = shared.target and shop.targets?[id]?.distance,
	}

	setupShopItems(id, shopType, shop.name, groups)

	return shop[id]
end

for shopType, shopDetails in pairs(lib.load('data.shops') or {}) do
	registerShopType(shopType, shopDetails)
end

---@param shopType string
---@param shopDetails OxShop
exports('RegisterShop', function(shopType, shopDetails)
	registerShopType(shopType, shopDetails)
end)

lib.callback.register('ox_inventory:openShop', function(source, data)
	local left, shop = Inventory(source)

	if not left then return end

	if data then
		shop = Shops[data.type]

		if not shop then return end

		if not shop.items then
			shop = (data.id and shop[data.id] or createShop(data.type, data.id))

			if not shop then return end
		end

		---@cast shop OxShop

		if shop.groups then
			local group = server.hasGroup(left, shop.groups)
			if not group then return end
		end

		if type(shop.coords) == 'vector3' and #(GetEntityCoords(GetPlayerPed(source)) - shop.coords) > 10 then
			return
		end

		---@diagnostic disable-next-line: assign-type-mismatch

		left:openInventory(left)
		left.currentShop = shop.id
	end

	return { label = left.label, type = left.type, slots = left.slots, weight = left.weight, maxWeight = left.maxWeight }, shop
end)

-- local function canAffordItem(inv, currency, price)
-- 	local canAfford = price >= 0 and Inventory.GetItemCount(inv, currency) >= price

-- 	return canAfford or {
-- 		type = 'error',
-- 		description = locale('cannot_afford', ('%s%s'):format((currency == 'money' and locale('$') or math.groupdigits(price)), (currency == 'money' and math.groupdigits(price) or ' '..Items(currency).label)))
-- 	}
-- end

local function canAffordItem(inv, currency, price)
    if price < 0 then
        return {
            type = 'error',
            description = locale('cannot_afford', 'invalid price')
        }
    end

    if currency == 'cash' then
        local count = Inventory.GetItemCount(inv, 'money')
        if count >= price then return true end

        return {
            type = 'error',
            description = locale('cannot_afford', locale('$') .. math.groupdigits(price))
        }
    elseif currency == 'bank' then
        local user = exports['limitless-core']:getComponent('User'):GetPlayer(inv.id)
        if user and user.bank >= price then return true end

        return {
            type = 'error',
            description = locale('cannot_afford', math.groupdigits(price) .. ' Bank')
        }
	end
end

local function removeCurrency(inv, currency, amount)
    if currency == 'money' then
        Inventory.RemoveItem(inv, 'money', amount)
    elseif currency == 'bank' then
        local user = exports['limitless-core']:getComponent('User'):GetPlayer(inv.id)
        if user then
            user.removeBank(amount)
        end
    end
end

local TriggerEventHooks = require 'modules.hooks.server'

local function isRequiredGrade(grade, rank)
	if type(grade) == "table" then
		for i=1, #grade do
			if grade[i] == rank then
				return true
			end
		end
		return false
	else
		return rank >= grade
	end
end

lib.callback.register('ox_inventory:buyItem', function(source, data)
    local playerInv = Inventory(source)
    if not playerInv or not playerInv.currentShop then return end

    local shopType, shopId = playerInv.currentShop:match('^(.-) (%d-)$')
    if not shopType then shopType = playerInv.currentShop end
    if shopId then shopId = tonumber(shopId) end

    local shop = shopId and Shops[shopType][shopId] or Shops[shopType]

    local method = data.method or 'money'

    local totalPrice = 0
    local purchaseList = {}

    for _, item in ipairs(data.items) do
        local fromData = nil
        for _, shopItem in pairs(shop.items) do
            if shopItem.name == item.name then
                fromData = shopItem
                break
            end
        end

        if not fromData then
            return false, false, { type = 'error', description = locale('item_notfound', item.name) }
        end

        local fromItem = Items(fromData.name)
        local quantity = item.quantity or 1

        if fromData.count and fromData.count < quantity then
            return false, false, { type = 'error', description = locale('shop_nostock') }
        end

        if fromData.license and server.hasLicense and not server.hasLicense(playerInv, fromData.license) then
            return false, false, { type = 'error', description = locale('item_unlicensed') }
        end

        if fromData.grade then
            local _, rank = server.hasGroup(playerInv, shop.groups)
            if not isRequiredGrade(fromData.grade, rank) then
                return false, false, { type = 'error', description = locale('stash_lowgrade') }
            end
        end

        local metadata, count = Items.Metadata(playerInv, fromItem, fromData.metadata and table.clone(fromData.metadata) or {}, quantity)
        local price = count * (item.price or fromData.price)

        totalPrice = totalPrice + price

        table.insert(purchaseList, {
            fromData = fromData,
            fromItem = fromItem,
            metadata = metadata,
            count = count,
            price = price
        })
    end

    local canAfford = canAffordItem(playerInv, method, totalPrice)
    if canAfford ~= true then
        return false, false, canAfford
    end

    for _, purchase in ipairs(purchaseList) do
        local newWeight = playerInv.weight + (purchase.fromItem.weight + (purchase.metadata?.weight or 0)) * purchase.count
        if newWeight > playerInv.maxWeight then
            return false, false, { type = 'error', description = locale('cannot_carry') }
        end

        Inventory.AddItem(playerInv, purchase.fromItem.name, purchase.count, purchase.metadata)

        playerInv.weight = newWeight

        if purchase.fromData.count then
            purchase.fromData.count = purchase.fromData.count - purchase.count
        end
    end

    removeCurrency(playerInv, method, totalPrice)

    if server.syncInventory then server.syncInventory(playerInv) end

    if server.loglevel > 0 then
        lib.logger(playerInv.owner, 'buyItem', ('"%s" bought %d items for %s'):format(playerInv.label, #purchaseList, totalPrice), ('shop:%s'):format(shop.label))
    end

    return true, { playerInv.items, playerInv.weight }, { type = 'success', description = message }
end)

server.shops = Shops
