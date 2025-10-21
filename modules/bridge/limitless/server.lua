local Inventory = require 'modules.inventory.server'

-- AddEventHandler('qbx_core:server:playerLoggedOut', server.playerDropped)

-- AddEventHandler('qbx_core:server:onGroupUpdate', function(source, groupName, groupGrade)
--     local inventory = Inventory(source)
--     if not inventory then return end
--     inventory.player.groups[groupName] = not groupGrade and nil or groupGrade
-- end)

local function setupPlayer(playerData)
    playerData.identifier = playerData.id
    playerData.name = ('%s %s'):format(playerData.firstname, playerData.lastname)
    server.setPlayerInventory(playerData)

    -- local accounts = Inventory.GetAccountItemCounts(playerData.source)
    -- if not accounts then return end
    -- for account in pairs(accounts) do
    --     local playerAccount = account == 'money' and 'cash' or account
    --     Inventory.SetItem(playerData.source, account, playerData.money[playerAccount])
    -- end
end

RegisterNetEvent('loadInventory', function ()
    local user = exports['limitless-core']:getComponent('User'):GetPlayer(source)
    if not user then return end
    setupPlayer(user)
end)

SetTimeout(500, function()
    local playersData = exports['limitless-core']:getComponent('User'):GetPlayers()
    for i = 1, #playersData do setupPlayer(playersData[i]) end
end)

---@diagnostic disable-next-line: duplicate-set-field
function server.setPlayerData(player)
    local user = exports['limitless-core']:getComponent('User'):GetPlayer(player.source)
    if not user then return end
    return {
        source = user.source,
        name = ('%s %s'):format(user.firstname, user.lastname),
        groups = user.groups,
        -- sex = user.gender,
        sex = (user.gender == 1) and "male" or "female",
        dateofbirth = user.dob,
    }
end

---@diagnostic disable-next-line: duplicate-set-field
-- function server.syncInventory(inv)
--     local accounts = Inventory.GetAccountItemCounts(inv)

--     if not accounts then return end

--     local player = QBX:GetPlayer(inv.id)
--     player.Functions.SetPlayerData('items', inv.items)

--     for account, amount in pairs(accounts) do
--         account = account == 'money' and 'cash' or account
--         if player.Functions.GetMoney(account) ~= amount then
--             player.Functions.SetMoney(account, amount, ('Sync %s with inventory'):format(account))
--         end
--     end
-- end

---@diagnostic disable-next-line: duplicate-set-field
function server.hasLicense(inv, license)
    -- local player = QBX:GetPlayer(inv.id)
    -- return player and player.PlayerData.metadata.licences[license]
end

---@diagnostic disable-next-line: duplicate-set-field
function server.buyLicense(inv, license)
    -- local player = QBX:GetPlayer(inv.id)
    -- if not player then return end

    -- if player.PlayerData.metadata.licences[license.name] then
    --     return false, 'already_have'
    -- elseif Inventory.GetItem(inv, 'money', false, true) < license.price then
    --     return false, 'can_not_afford'
    -- end

    -- Inventory.RemoveItem(inv, 'money', license.price)
    -- player.PlayerData.metadata.licences[license.name] = true
    -- player.Functions.SetMetaData('licences', player.PlayerData.metadata.licences)

    -- return true, 'have_purchased'
end

---@diagnostic disable-next-line: duplicate-set-field
function server.isPlayerBoss(playerId, group, grade)
    -- return QBX:IsGradeBoss(group, grade)
end

-- ---@param entityId number
-- ---@return number | string
-- ---@diagnostic disable-next-line: duplicate-set-field
-- function server.getOwnedVehicleId(entityId)
--     -- return Entity(entityId).state.vehicleid or exports.qbx_vehicles:GetVehicleIdByPlate(GetVehicleNumberPlateText(entityId))
-- end

AddEventHandler('onResourceStart', function(resourceName)
    if 'limitless-login' == resourceName or 'limitless-core' == resourceName then
        for _, v in pairs(GetPlayers()) do
            server.playerDropped(v)
        end
    end
end)