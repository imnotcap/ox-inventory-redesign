return {

	['bandage'] = {
		label = 'Bandage',
		weight = 115,
		rarity = 'common',
		client = {
			anim = { dict = 'missheistdockssetup1clipboard@idle_a', clip = 'idle_a', flag = 49 },
			prop = { model = `prop_rolled_sock_02`, pos = vec3(-0.14, -0.14, -0.08), rot = vec3(-50.0, -50.0, 0.0) },
			disable = { move = true, car = true, combat = true },
			usetime = 2500,
		}
	},

	['black_money'] = {
		label = 'Dirty Money',
		rarity = 'rare',
	},

	['handcuffs'] = {
		label = 'Håndjern',
		weight = 250,
		useable = true,
		close = false,
		description = 'Bruges til at sætte folk i håndjern',
		rarity = 'common',
	},

	['burger'] = {
		label = 'Burger',
		weight = 220,
		rarity = 'common',
		client = {
			status = { hunger = 200000 },
			anim = 'eating',
			prop = 'burger',
			usetime = 2500,
			notification = 'You ate a delicious burger'
		},
	},

	['sprunk'] = {
		label = 'Sprunk',
		weight = 350,
		rarity = 'common',
		client = {
			status = { thirst = 200000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_ld_can_01`, pos = vec3(0.01, 0.01, 0.06), rot = vec3(5.0, 5.0, -180.5) },
			usetime = 2500,
			notification = 'You quenched your thirst with a sprunk'
		}
	},

	['parachute'] = {
		label = 'Parachute',
		weight = 8000,
		stack = false,
		rarity = 'epic',
		client = {
			anim = { dict = 'clothingshirt', clip = 'try_shirt_positive_d' },
			usetime = 1500
		}
	},

	['garbage'] = {
		label = 'Garbage',
		rarity = 'common',
	},

	['paperbag'] = {
		label = 'Paper Bag',
		weight = 1,
		stack = false,
		close = false,
		consume = 0,
		rarity = 'common',
	},

	['panties'] = {
		label = 'Knickers',
		weight = 10,
		consume = 0,
		rarity = 'rare',
		client = {
			status = { thirst = -100000, stress = -25000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_cs_panties_02`, pos = vec3(0.03, 0.0, 0.02), rot = vec3(0.0, -13.5, -1.5) },
			usetime = 2500,
		}
	},

	['lockpick'] = {
		label = 'Lockpick',
		weight = 160,
		rarity = 'uncommon',
		description = 'Lås op for nye veje og muligheder',
	},

	['phone'] = {
		label = 'Phone',
		weight = 190,
		stack = false,
		consume = 0,
		rarity = 'uncommon',
		client = {
			add = function(total)
				if total > 0 then pcall(function() return exports.npwd:setPhoneDisabled(false) end) end
			end,
			remove = function(total)
				if total < 1 then pcall(function() return exports.npwd:setPhoneDisabled(true) end) end
			end
		}
	},

	['mustard'] = {
		label = 'Mustard',
		weight = 500,
		rarity = 'uncommon',
		client = {
			status = { hunger = 25000, thirst = 25000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_food_mustard`, pos = vec3(0.01, 0.0, -0.07), rot = vec3(1.0, 1.0, -1.5) },
			usetime = 2500,
			notification = 'You.. drank mustard'
		}
	},

	-- Drikkevarer

	['whiskey'] = {
		label = 'Whiskey',
		weight = 500,
		rarity = 'mythic',
		client = {
			status = { thirst = -1000000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `ba_prop_battle_whiskey_bottle_s`, pos = vec3(0.03, 0.03, 0.02), rot = vec3(0.0, 0.0, -1.5) },
			usetime = 2500,
			cancel = true,
			notification = 'Du er alkoholiker'
		},
		description = 'Det siges at alkohol gør dig mere tørstig...',
	},

	['water'] = {
		label = 'Water',
		weight = 500,
		rarity = 'common',
		client = {
			status = { thirst = 200000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_ld_flow_bottle`, pos = vec3(0.03, 0.03, 0.02), rot = vec3(0.0, 0.0, -1.5) },
			usetime = 2500,
			cancel = true,
			notification = 'You drank some refreshing water'
		}
	},

	['radio'] = {
		label = 'Radio',
		weight = 1000,
		stack = false,
		allowArmed = true,
		rarity = 'uncommon',
	},

	['armor'] = {
		label = 'Skudsikker Vest',
		weight = 1000,
		stack = false,
		rarity = 'uncommon',
		client = {
			anim = { dict = 'clothingshirt', clip = 'try_shirt_positive_d' },
			usetime = 3500
		},
		description = 'Giver dig ekstra beskyttelse mod skader fra skud, knivstik og slag.',
	},

	['clothing'] = {
		label = 'Clothing',
		consume = 0,
		rarity = 'uncommon',
	},

	['mastercard'] = {
		label = 'Fleeca Card',
		stack = false,
		weight = 10,
		rarity = 'rare',
		client = { image = 'card_bank.png' }
	},

	['scrapmetal'] = {
		label = 'Scrap Metal',
		weight = 80,
		rarity = 'common',
	},

	['id_card'] = {
		label = 'ID Kort',
		weight = 10,
		rarity = 'common',
	},
	
	['pd_badge'] = {
		label = 'Politiskilt',
		weight = 50,
		image = 'pd_badge.png',
		stack = false,
		useable = true,
		close = true,
		rarity = 'rare',
	},
	
	['medkit'] = {
		label = 'Førstehjælpskit',
		weight = 1000,
		image = 'medkit.png',
		stack = false,
		useable = true,
		close = true,
		rarity = 'rare',
		description = 'Bruges til at hele alvorlige skader',
	},
	
	['painkillers'] = {
		label = 'Smertestillende',
		weight = 250,
		image = 'painkillers.png',
		stack = false,
		useable = true,
		close = true,
		rarity = 'uncommon',
	},
	
	['thermite'] = {
		label = 'Thermite',
		weight = 750,
		image = 'thermite.png',
		stack = true,
		useable = true,
		close = true,
		description = 'Kan fremstille en ekstrem varme på omkring 2.500°C',
		rarity = 'epic',
	},
	
	['nitrousoxide'] = {
		label = 'Nitrous Oxide',
		weight = 1500,
		image = 'nitrousoxide.png',
		stack = true,
		useable = true,
		close = true,
		rarity = 'epic',
	},
	
	['pickaxe'] = {
		label = 'Hakke',
		weight = 4000,
		image = 'pickaxe.png',
		stack = true,
		useable = true,
		close = true,
		rarity = 'uncommon',
	},
	
	['turbo'] = {
		label = 'Turbo',
		weight = 2000,
		image = 'turbo.png',
		stack = true,
		useable = true,
		close = true,
		description = 'Bruges til at installere turboer i biler',
		rarity = 'legendary',
	},
	
	['nokia_burner'] = {
		label = 'Nokia 3310',
		weight = 1,
		image = 'phone.png',
		stack = false,
		useable = true,
		close = true,
		description = 'Telefon som er værd at miste',
		rarity = 'rare',
	},

-- crafting

	['metalscrap'] = {
		label = 'Metal Skrot',
		weight = 350,
		image = 'metalscrap.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['electronickit'] = {
		label = 'Elektronik Sæt',
		weight = 350,
		image = 'electronickit.png',
		stack = true,
		useable = true,
		close = true,
		rarity = 'rare',
	},

	['steel'] = {
		label = 'Stål',
		weight = 350,
		image = 'steel.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'uncommon',
	},

	['aluminum'] = {
		label = 'Aluminium',
		weight = 350,
		image = 'aluminum.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'uncommon',
	},

	['glass'] = {
		label = 'Glas',
		weight = 350,
		image = 'glass.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['plastic'] = {
		label = 'Plastik',
		weight = 350,
		image = 'plastic.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['scrapiron'] = {
		label = 'Jernklumper',
		weight = 500,
		image = 'iron_nugget.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['copper'] = {
		label = 'Kobber',
		weight = 350,
		image = 'copper.png',
		stack = true,
		useable = true,
		close = true,
		rarity = 'uncommon',
	},

	['boosting-laptop'] = {
		label = 'Computer',
		weight = 3500,
		image = 'laptop.png',
		stack = false,
		useable = false,
		close = false,
		description = 'Computer til Boosting',
		rarity = 'epic',
	},
}