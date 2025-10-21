AddStateBagChangeHandler('isLoggedIn', ('player:%s'):format(cache.serverId), function(_, _, value)
    if not value then client.onLogout() end
end)

RegisterNetEvent('qbx_core:client:onGroupUpdate', function(groupName, groupGrade)
    local groups = nil
    client.setPlayerData('groups', groups)
end)

RegisterNetEvent('qbx_core:client:setGroups', function(groups)
    client.setPlayerData('groups', groups)
end)

---@diagnostic disable-next-line: duplicate-set-field
function client.setPlayerStatus(values)

    if values.hunger then
        if values.hunger > 100 or values.hunger < -100 then
            values.hunger = values.hunger * 0.0001
        end
        print('Adding hunger: ' .. values.hunger)
        TriggerServerEvent('limitless-core:AddHunger', values.hunger)
    end

    if values.thirst then
        if values.thirst > 100 or values.thirst < -100 then
            values.thirst = values.thirst * 0.0001
        end
        print('Adding thirst: ' .. values.thirst)
        TriggerServerEvent('limitless-core:AddThirst', values.thirst)
    end
end

RegisterNetEvent('ox_inventory:usedItem', function(itemName, slot, metadata)
    TriggerEvent('inventory:client:itemUsed', {
        name = itemName,
        metadata = metadata
    })
end)