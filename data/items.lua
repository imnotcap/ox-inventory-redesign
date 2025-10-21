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

	-- Fishing
	['fishingrod'] = {
		label = 'Fiskestang',
		weight = 1500,
		image = 'fishingrod.png',
		stack = false,
		useable = true,
		close = true,
		description = 'En stang til at fiske🤓',
		rarity = 'uncommon',
	},

	['fishing-bass'] = {
		label = 'Bas',
		weight = 1000,
		image = 'fishing-bass.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['fishing-carp'] = {
		label = 'Karpe',
		weight = 1000,
		image = 'fishing-carp.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['fishing-cod'] = {
		label = 'Torsk',
		weight = 1000,
		image = 'fishing-cod.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['fishing-flounder'] = {
		label = 'Skrubbe',
		weight = 1000,
		image = 'fishing-flounder.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['fishing-mackerel'] = {
		label = 'Makrel',
		weight = 1000,
		image = 'fishing-mackerel.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['fishing-salmon'] = {
		label = 'Laks',
		weight = 1000,
		image = 'fishing-salmon.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'uncommon',
	},

	['fishing-yellowperch'] = {
		label = 'Gul Aborre',
		weight = 1000,
		image = 'fishing-yellowperch.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'uncommon',
	},

	['bottlemail'] = {
		label = 'Flaskepost',
		weight = 1000,
		image = 'bottlemail.png',
		stack = true,
		useable = true,
		close = true,
		consume = 0,
		description = 'En mystisk flaskepost',
		rarity = 'rare',
	},

	['huntingbait'] = {
		label = 'Jagt lokkemad',
		weight = 100,
		image = 'huntingbait.png',
		stack = true,
		useable = true,
		close = false,
		rarity = 'uncommon',
	},

	['hunting-meat'] = {
		label = 'Jagt kød',
		weight = 1500,
		image = 'hunting-meat.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'common',
	},

	['hunting-leather'] = {
		label = 'Dyreskind',
		weight = 1500,
		image = 'hunting-leather.png',
		stack = true,
		useable = false,
		close = false,
		rarity = 'uncommon',
	},

	-- Oxy Items
	['package'] = {
		label = 'Pakke',
		weight = 15000,
		image = 'package.png',
		stack = false,
		useable = false,
		close = false,
		description = 'En mistænkelig pakke',
		rarity = 'rare',
	},

	['oxy'] = {
		label = 'Oxy 100mg',
		weight = 10,
		image = 'oxy.png',
		stack = true,
		useable = true,
		close = true,
		description = 'Lindrer smerten lMaO',
		rarity = 'epic',
	},

	['postalpackage'] = {
		label = 'Post pakke',
		weight = 3500,
		image = 'box.png',
		stack = true,
		useable = false,
		close = true,
		description = 'Hvorfor har du stadig denne..? Kunden har brug for den😡',
		rarity = 'common',
	},

	-- Miner Job
	['paydirt'] = {
		label = 'Paydirt',
		weight = 1000,
		image = 'paydirt.png',
		stack = true,
		useable = false,
		close = false,
		description = 'A bag of paydirt',
		rarity = 'common',
	},

	['prempaydirt'] = {
		label = 'Premium Paydirt',
		weight = 1000,
		image = 'prempaydirt.png',
		stack = true,
		useable = false,
		close = false,
		description = 'A bag of premium paydirt',
		rarity = 'uncommon',
	},

	['sand'] = {
		label = 'Sand',
		weight = 1000,
		image = 'sand.png',
		stack = true,
		useable = false,
		close = false,
		description = 'Sand',
		rarity = 'common',
	},

	['iron_nugget'] = {
		label = 'Jern Klump',
		weight = 350,
		image = 'iron_nugget.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'common',
	},

	['iron_bar'] = {
		label = 'Jern Bar',
		weight = 1000,
		image = 'iron_bar.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'uncommon',
	},

	['gold_nugget'] = {
		label = 'Guld Klump',
		weight = 400,
		image = 'gold_nugget.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'rare',
	},

	['stone'] = {
		label = 'Sten',
		weight = 700,
		image = 'stone.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'common',
	},

	['copperore'] = {
		label = 'Kobber Malm',
		weight = 350,
		image = 'copperore.png',
		stack = true,
		useable = false,
		close = false,
		description = '',
		rarity = 'common',
	},

	['uncut_emerald'] = {
		label = 'Ukåret Smaragd',
		weight = 350,
		image = 'uncut_emerald.png',
		stack = true,
		useable = false,
		close = false,
		description = '',
		rarity = 'rare',
	},

	['uncut_ruby'] = {
		label = 'Ukåret Rubin',
		weight = 350,
		image = 'uncut_ruby.png',
		stack = true,
		useable = false,
		close = false,
		description = '',
		rarity = 'rare',
	},

	['uncut_diamond'] = {
		label = 'Ukåret Diamant',
		weight = 350,
		image = 'uncut_diamond.png',
		stack = true,
		useable = false,
		close = false,
		description = '',
		rarity = 'epic',
	},

	['uncut_sapphire'] = {
		label = 'Ukåret Safir',
		weight = 350,
		image = 'uncut_sapphire.png',
		stack = true,
		useable = false,
		close = false,
		description = '',
		rarity = 'rare',
	},

	['welcomepackage'] = {
		label = 'Velkomst gave',
		weight = 3500,
		image = 'package.png',
		stack = true,
		useable = true,
		close = false,
		description = 'Velkommen til! Vi håber du kommer til at nyde dit ophold! Her er lidt til at få dig igang!',
		rarity = 'uncommon',
	},

	['repairkit_full'] = {
		label = 'Toolkit - Fuldt',
		weight = 3500,
		image = 'repairkit.png',
		stack = true,
		useable = true,
		close = false,
		description = 'Reparer hele bilen. Visuelt og mekanisk.',
		rarity = 'rare',
	},

	['repairkit_visual'] = {
		label = 'Toolkit - Visuelt',
		weight = 3500,
		image = 'repairkit.png',
		stack = true,
		useable = true,
		close = false,
		description = 'Reparer det visuelle på bilen.',
		rarity = 'common',
	},

	['repairkit_engine'] = {
		label = 'Toolkit - Motor',
		weight = 3500,
		image = 'repairkit.png',
		stack = true,
		useable = true,
		close = false,
		description = 'Reparer det mekaniske.',
		rarity = 'uncommon',
	},

	['usb_yellow'] = {
		label = 'Gul USB',
		weight = 100,
		image = 'usb_yellow.png',
		stack = true,
		useable = true,
		close = false,
		description = 'Et uskyldigt usb stik..?',
		rarity = 'uncommon',
	},

	['usb_blue'] = {
		label = 'Blå USB',
		weight = 100,
		image = 'usb_blue.png',
		stack = true,
		useable = true,
		close = false,
		description = 'Et uskyldigt usb stik..?',
		rarity = 'rare',
	},

	['usb_red'] = {
		label = 'Rød USB',
		weight = 100,
		image = 'usb_red.png',
		stack = true,
		useable = true,
		close = false,
		description = 'Et uskyldigt usb stik..?',
		rarity = 'rare',
	},

	['usb_purple'] = {
		label = 'LimitlessOS USB',
		weight = 100,
		image = 'usb_purple.png',
		stack = false,
		useable = false,
		close = false,
		description = 'Limitless..? Som OS?',
		rarity = 'epic',
	},

	['usb_green'] = {
		label = 'USB Stik',
		weight = 100,
		image = 'usb_green.png',
		stack = false,
		useable = false,
		close = false,
		description = 'Kan den her noget mon?',
		rarity = 'uncommon',
	},

	['toast'] = {
		label = 'Toast',
		weight = 250,
		image = 'toast.png',
		description = 'Dælme en go\' toast',
		rarity = 'common',
		client = {
			status = { hunger = 300000 }, -- 30%
			anim = 'eating',
			prop = 'burger',
			usetime = 2500,
			notification = 'Lækker toast! 👅👅'
		},
	},

	['tuner_wheel'] = {
		label = 'Hjul',
		weight = 1000,
		image = 'wheel.png',
		stack = false,
		useable = true,
		close = false,
		description = 'Bruges typisk til tuning - Los Santos Customs',
		rarity = 'uncommon',
	},

	['tuner_spraycan'] = {
		label = 'Farve spraydåse',
		weight = 250,
		image = 'spraycan.png',
		stack = false,
		useable = true,
		close = false,
		description = 'Bruges typisk til omfarve - Los Santos Customs',
		rarity = 'common',
	},

	['vpn'] = {
		label = 'VPN',
		weight = 1000,
		image = 'vpn.png',
		stack = false,
		useable = false,
		close = false,
		description = 'Måske den kan bruges til noget kriminelt?',
		rarity = 'rare',
	},

	['weed_grinder'] = {
		label = 'Weed Grinder',
		weight = 300,
		image = 'weed_grinder.png',
		stack = false,
		useable = false,
		close = false,
		description = 'Grind yo weed',
		rarity = 'uncommon',
	},

	['meth_kit'] = {
		label = 'Meth Kit',
		weight = 3000,
		image = 'duffelbag.png',
		stack = false,
		useable = true,
		close = false,
		description = 'Der er stor chance for denne er relateret til noget kriminelt. Siger det bare🤷',
		rarity = 'epic',
	},

	['tablet'] = {
		label = 'Tablet',
		weight = 1500,
		image = 'tablet.png',
		stack = true,
		useable = false,
		close = false,
		description = 'En tablet med USB understøttelse.',
		rarity = 'common',
	},

	['repair_part_electronics'] = {
		label = 'Køretøj Elektronik',
		weight = 1000,
		image = 'repair_part_electronics.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'uncommon',
	},

	['repair_part_transmission'] = {
		label = 'Gearkasse',
		weight = 3500,
		image = 'repair_part_transmission.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'uncommon',
	},

	['repair_part_axle'] = {
		label = 'Aksel',
		weight = 1500,
		image = 'repair_part_axle.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'uncommon',
	},

	['repair_part_brakes'] = {
		label = 'Bremser',
		weight = 1500,
		image = 'repair_part_brakes.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'uncommon',
	},

	['repair_part_timingbelt'] = {
		label = 'Tandrem',
		weight = 250,
		image = 'repair_part_timingbelt.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'common',
	},

	['repair_part_clutch'] = {
		label = 'Kobling',
		weight = 250,
		image = 'repair_part_clutch.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'common',
	},

	['repair_part_turbo'] = {
		label = 'Reservedels turbo',
		weight = 5050,
		image = 'turbo.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'rare',
	},

	['repair_part_radiator'] = {
		label = 'Køler',
		weight = 6550,
		image = 'repair_part_rad.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'uncommon',
	},

	['electronic_parts'] = {
		label = 'Elektroniske dele',
		weight = 250,
		image = 'electronic_parts.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'common',
	},

	['rubber'] = {
		label = 'Gummi',
		weight = 75,
		image = 'rubber.png',
		stack = true,
		useable = true,
		close = false,
		description = '',
		rarity = 'common',
	},

	['traumakit'] = {
		label = 'Traume kit',
		weight = 500,
		image = 'traumakit.png',
		stack = true,
		useable = false,
		close = false,
		description = 'Avanceret medicinsk udstyr til kritiske situationer.',
		rarity = 'rare',
	},

	['evidence'] = {
		label = 'Bevismateriale',
		weight = 10,
		image = 'evidence.png',
		stack = false,
		useable = true,
		close = false,
		description = 'Kan være vigtigt i en efterforskning.',
		rarity = 'epic',
	},

	-- Backpacks

	['backpack'] = {
		label = 'Militærtaske',
		weight = 3000,
		stack = false,
		useable = true,
		close = false,
		description = 'Kan være rigtig praktisk til at have ting i',
		rarity = 'legendary',
	},

	['money'] = {
		label = 'Pengebundt',
		description = 'Bruges til at købe ting med',
		rarity = 'common',
	},






    -- Limitless Drug

    -- Weed
    ['weed_seed'] = {
        label = 'Weed Frø',
        weight = 100,
        image = 'weed_seed.png',
        stack = true,
        useable = false,
        close = false,
        description = 'Frø til at plante weed',
        rarity = 'common',
    },

    ['weedtable'] = {
        label = 'Weed Bord',
        weight = 5000,
        image = 'weedtable.png',
        stack = false,
        useable = true,
        close = false,
        description = 'Bruges til at lave weed produkter',
        rarity = 'uncommon',
    },

    ['weedscissors'] = {
        label = 'Weed Saks',
        weight = 500,
        image = 'weedscissors.png',
        stack = false,
        useable = true,
        close = false,
        description = 'Bruges til at klippe weed',
        rarity = 'common',
    },

    ['plantpot'] = {
        label = 'Plante Potte',
        weight = 2000,
        image = 'plantpot.png',
        stack = false,
        useable = true,
        close = false,
        description = 'Bruges til at plante frø i',
        rarity = 'common',
    },

    ['weed_baggy_empty'] = {
        label = 'Weed Pose (Tom)',
        weight = 50,
        image = 'weed_baggy_empty.png',
        stack = true,
        useable = false,
        close = false,
        description = 'En tom pose til at opbevare weed i',
        rarity = 'common',
    },

    ['weedbag_1'] = {
        label = 'Weed Pose',
        weight = 100,
        image = 'weedbag_1.png',
        stack = true,
        useable = true,
        close = false,
        description = '1 stjernet weed',
        rarity = 'common',
    },
    ['weedbag_2'] = {
        label = 'Weed Pose',
        weight = 200,
        image = 'weedbag_2.png',
        stack = true,
        useable = true,
        close = false,
        description = '2 stjernet weed',
        rarity = 'common',
    },
    ['weedbag_3'] = {
        label = 'Weed Pose',
        weight = 300,
        image = 'weedbag_3.png',
        stack = true,
        useable = true,
        close = false,
        description = '3 stjernet weed',
        rarity = 'common',
    },

    ['weedbud_1'] = {
        label = 'Weed Bud',
        weight = 100,
        image = 'weedbud_1.png',
        stack = true,
        useable = false,
        close = false,
        description = '1 stjernet weed bud',
        rarity = 'common',
    },
    ['weedbud_2'] = {
        label = 'Weed Bud',
        weight = 200,
        image = 'weedbud_2.png',
        stack = true,
        useable = false,
        close = false,
        description = '2 stjernet weed bud',
        rarity = 'common',
    },
    ['weedbud_3'] = {
        label = 'Weed Bud',
        weight = 300,
        image = 'weedbud_3.png',
        stack = true,
        useable = false,
        close = false,
        description = '3 stjernet weed bud',
        rarity = 'common',
    },

    ['joint'] = {
        label = 'Joint',
        weight = 50,
        image = 'joint.png',
        stack = true,
        useable = true,
        close = false,
        description = 'En lille joint',
        rarity = 'common',
    },

    ['weedleaf_1'] = {
        label = 'Weed Blade',
        weight = 100,
        image = 'weedleaf_1.png',
        stack = true,
        useable = false,
        close = false,
        description = '1 stjernet weed blade',
        rarity = 'common',
    },
    ['weedleaf_2'] = {
        label = 'Weed Blade',
        weight = 200,
        image = 'weedleaf_2.png',
        stack = true,
        useable = false,
        close = false,
        description = '2 stjernet weed blade',
        rarity = 'common',
    },
    ['weedleaf_3'] = {
        label = 'Weed Blade',
        weight = 300,
        image = 'weedleaf_3.png',
        stack = true,
        useable = false,
        close = false,
        description = '3 stjernet weed blade',
        rarity = 'common',
    },

    ['weed_dryer'] = {
        label = 'Weed Tørrer',
        weight = 10000,
        image = 'weed_dryer.png',
        stack = false,
        useable = true,
        close = false,
        description = 'Bruges til at tørre weed',
        rarity = 'rare',
    }
}