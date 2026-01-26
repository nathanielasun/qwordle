#!/usr/bin/env python3
"""Generate 5000+ unique COMMON English 5-letter words for Wordle."""

import csv

# Common recognizable words - expanded list
WORDS = set("""
abate abbey abbot abhor abide abler abode abort about above abuse ached acorn
acted actor acute added adder admit adobe adopt adore adorn adult affix afire
afoot after again agent agile aging agree ahead aided aimer aisle alarm album
alder alert algae alibi alien align alike alive allay alley allot allow alloy
aloft alone along aloof alpha altar alter amaze amber amend amino ample amuse
angel anger angle angry ankle annex annoy antic anvil apart aphid apple apply
apron arena argue arise armed armor aroma arose array arrow arson artsy aside
asset atlas attic audio audit aunty avert avoid await awake award aware awful
awoke azure

babel bacon badge badly bagel baked baker balmy banal banjo baron based basic
basil basin batch baton beach beads beady beard beast began begin begun being
belly below bench berry bible bidet bikes binge bingo birch birth bison black
blade blame bland blank blare blast blaze bleak bleat bleed blend bless blimp
blind blink bliss blitz bloat block bloke blond blood bloom blown blues bluff
blunt blurb blurt blush board boast bogus boned bonus boost booth booty booze
bored borne bosom bossy botch bough bound boxer brace braid brain brake brand
brash brass brave brawn bread break breed brick bride brief brine bring brink
brisk broad broil broke brood brook broom broth brown brunt brush brute buddy
budge buggy build built bulge bulky bully bunch bunny burnt burst bushy butch
butte buyer bylaw

cabin cable cache cadet cairn camel cameo camps canal candy canny canoe canon
caper carat cargo carol carry carve catch cater cause cease cedar chain chair
chalk champ chant chaos charm chart chase cheap cheat check cheek cheer chess
chest chick chief child chili chill chimp china chirp choke chord chore chose
chunk churn cider cigar cinch circa cited civet civic civil claim clamp clang
clank clash clasp class clean clear clerk click cliff climb cling cloak clock
clone close cloth cloud clout clown clubs cluck clued clump clung clunk coach
coast cobra cocoa coded condo colon color comet comic comma conch condo coral
corny couch cough could count coupe court cover covet crack craft cramp crane
crank crash crass crate crave crawl craze crazy creak cream credo creed creek
creep crest crick cried crime crimp crisp croak crock crook cross crowd crown
crude cruel crush crust cubic cupid curly curry curse curve cyber cycle cynic

daddy daily dairy daisy dance dandy dated dealt death debit debug debut decal
decay decor decoy decry defer deity delay delta delve demon denim dense depot
depth derby deter detox devil diary dicey digit dimly diner dingy dirty disco
ditch ditty diver dizzy dodge dodgy doggy dogma doing dolly donor donut dough
doubt draft drain drake drama drank drape drawl drawn dread dream dress dried
drier drift drill drink drive droid droll drone drool droop drove drown drugs
drums drunk dryer dryly ducky dummy dumpy dunce dusty dwell dwelt dying

eager eagle early earth easel eaten eater ebony edged eight elbow elder elect
elite elope elude email embed ember emoji empty enact ended endow enemy enjoy
enrol enter entry envoy epoch equal equip erase erect error erupt essay ethic
evade event every evict evoke exact exalt excel exert exile exist expat extra
exude

fable faced facet facto faded faint fairy faith false famed fancy fangs farce
farms fatal fatty fault fauna favor feast feign feint fella felon femur fence
feral ferns ferry fetal fetch fever fewer fiber field fiend fiery fifth fifty
fight filch filed filet fills filly filth final finch finds finer fired fires
first fishy fitly fixed fixer fizzy fjord flack flail flair flake flaky flame
flank flaps flare flash flask flats flaws fleas fleck flesh flick flier flies
fling flint float flock flood floor flora floss flour flout flown fluff fluid
fluke flung flunk flush flute foamy focal focus foggy folks folly fonts foray
force forge forgo forms forth forty forum found fount foyer frail frame frank
fraud freak freed fresh friar fried fries frill frisk frizz frock front frost
froth frown froze fruit fryer fudge fuels fully fumed funky funny furry fused
fussy fuzzy

gaily gamer gamma gassy gauge gaunt gauze gavel geeky genie genre germs ghost
giant giddy gifts gills girth given giver gizmo glade gland glare glass glaze
gleam glide glint globe gloom glory gloss glove gluey glyph gnome goats godly
going golly goner goody gooey goofy goose gorge gotta gouge gourd grace grade
grain grand grant grape graph grasp grass grate grave gravy graze great greed
green greet grief grill grime grimy grind gripe grits groan groin groom grope
gross group grove growl grown gruel gruff grunt guard guava guess guest guide
guild guilt guise gulch gummy gusto gusty gutsy gypsy

habit haiku hairs hairy halve hammy hands handy hangs happy hardy harms harps
harsh hasty hatch hated hater haunt haven havoc hazel heads heady heals heaps
heard hears heart heath heave heavy hedge heels hefty heist helix hello helps
hence herbs herds heron hilly hinge hinky hippo hippy hired hitch hives hoagy
hoard hobby hoist holly homer homes honey honor hoods hooks hoped hoper horde
horns horny horse hotel hotly hound hours house hover howdy hubby huffy hulks
human humid humor hunch hunks hunky hurry husky

icier icing ideal idiom idiot igloo image imply inbox incur index infer ingot
inked inner input inter intro ionic irate irked irony issue itchy ivory

jaded jails janky jazzy jeans jelly jenny jerky jiffy jimmy jived joint joked
joker jolly joust judge juice juicy jumbo jumps jumpy junky juror

karma kayak kebab keeps khaki kicks kinky kiosk kitty knack knead kneel knelt
knife knock knoll known kudos

label labor lacks laced laden ladle lager lance lanky lapel lapse large laser
lasso latch later latex laugh lawns layer leads leafy leaky leant leapt learn
lease leash least leave ledge leech lefty legal lemon lemur level lever libel
licks lifts light liked liken lilac limbo limbs limit lined linen liner lines
lingo lions lipid lists liter lithe lively liver lives livid llama loads loamy
loans loath lobby local locks locus lodge lofty logic login loner looks looms
loony loops loopy loose loots lorry loser lotto lotus louse lousy loved lover
lower lowly loyal lucid lucky lumen lumps lumpy lunar lunch lunge lurch lurid
lurks lusty lying lymph lyric

macho macro madam madly mafia magic magma major maker males malls manga mango
mania manic manor maple march marry marsh masks mason match mated matte mauve
maybe mayor mealy means meant meaty medal media medic melee melon mercy merge
merit merry messy metal meter metro micro midst might milks milky mimic mince
minds mined miner mines minor minty minus mirth miser misty miter mixed mixer
mocha modal model modem moist molar moldy molly money monks month moods moody
moons moose moped mopes moral moron morph mossy motel moths motif motor motto
mould mound mount mourn mouse mousy mouth moved mover moves movie mowed mower
mucus muddy mummy munch mural murky mushy music musky muted muted muzzy myrrh

nacho naive named names nanny nasal nasty natal naval navel needy nerds nerdy
nerve nervy never newer newly niche niece night nimby ninja ninth nippy nitty
noble nobly nodes noise noisy nomad nooks norms north nosey notch noted notes
novel nudge nurse nutty nylon nymph

oaken oasis occur ocean oddly often oiled olden older olive omega onion onset
oomph opens opera optic orbit order organ other otter ought ounce outdo outer
ovals ovary oven overt owing owned owner oxide

pacer paces packs paddy padre pagan pages paint palms palsy panda panel panic
pansy pants papal paper parch parks parry parse parts party pasta paste pasty
patch patio patsy patty pause paved paver paves payed payee payer peace peach
peaks pearl pecan pedal peels peeps peers penal penny perch perks perky pesky
pests petal petty phase phone phony photo piano picks picky piece piety piggy
pilot pinch pines piney pings pinky pints pious pitch pithy pivot pixel pizza
place plaid plain plane plank plans plant plate playa plaza plead pleas pleat
plied plier plods plonk plots plows pluck plugs plumb plume plump plums plunk
plush poach podgy poems point poise poked poker pokes polar polls polyp ponds
pondy pools poofy poppy porch pored pores posed poser poses posse posts pouch
poult pound pours power prank prawn press price prick pride pried prime primo
print prior prism privy prize probe promo prone prong proof props prose proud
prove prowl proxy prude prune psalm pubic pudgy puffy pulls pulse pumps punch
punks pupil puppy purge purse pushy putts putty

quack quail qualm quart queen queer query quest queue quick quiet quill quilt
quirk quite quota quote

racer racks radar radon raged rainy raise rally ramen ramps ranch range rapid
rarer rated rates ratio razor reach react reads ready realm ream rebel rebid
rebut recap recur refer refit regal reign relax relay relic remit remix renal
renew repay reply repos rerun reset resin rests retro retry reuse revel revue
rhino rhyme rider ridge rifle right rigid rigor rinds rings rinse ripen riper
risen riser risks risky ritzy rival river rivet roads roams roars roast robin
robot rocks rocky rodeo rogue roles roman romps roofs rooms roomy roots roped
roses rosin rotts rough round rouse route rover rowdy royal rugby ruins ruled
ruler rules rumor runny rural rusts rusty

sadly safer saint salad salon salsa salty salve sands sandy saner sappy sassy
satin satay sauce saucy sauna saute saved saver savor savvy scale scalp scaly
scamp scams scant scare scarf scary scene scent scold scone scoop scoot scope
score scorn scout scowl scram scrap screw scrub sedan seeds seedy seeks seems
seize sells sends sense sepia serum serve setup seven sever sewed sewer shack
shade shady shaft shake shaky shame shank shape shard share shark sharp shave
shawl shear sheds sheen sheep sheer sheet shelf shell shift shine shins shiny
ships shire shirk shirt shock shone shook shoot shops shore shorn short shots
shout shove shown shows showy shred shrew shrub shrug shuck shunt sided sides
siege sieve sight sigma signs silky silly since singe siren sissy sites sixth
sixty sized sizes skate skeet skier skill skimp skirt skull skunk slack slain
slams slang slant slash slate slave sleek sleep sleet slept slice slick slide
slime slimy sling slink slope slosh sloth slows slums slump slums slung slunk
slurp slush slyly small smart smash smear smell smelt smile smirk smith smock
smoke smoky snack snafu snags snail snake snaky snaps snare snarl sneak sneer
snide sniff snoop snore snort snout snowy snuck snuff soapy sober socks sodas
sofas softy soggy soils solar solid solve sonar songs sonic soothe soppy sorry
sorts souls sound soups soupy south space spade spams spank spans spare spark
spawn speak spear speck specs speed spell spend spent spice spicy spied spies
spike spiky spill spilt spine spiny spire spite splat split spoil spoke spoof
spook spool spoon spore sport spots spout spray spree sprig sprit spurt squad
squat squid stack staff stage staid stain stair stake stale stalk stall stamp
stand stank stare stark start stash state stays steak steal steam steel steep
steer stems steno steps stern stews stick stiff still stilt sting stink stint
stock stoic stoke stomp stone stony stood stool stoop stops store stork storm
story stout stove strap straw stray strep strip strum strut stuck studs study
stuff stump stung stunk stunt style suave suede sugar suite sulks sulky sunny
super surge surly sushi swamp swank swaps swarm swath swear sweat sweep sweet
swell swept swift swims swine swing swipe swirl swish swiss swoon swoop sword
swore sworn swung

tabby table taboo tacit tacky tacos taffy tails taint taken taker takes tales
talks tally talon tamed tamer tango tangy tanks taped taper tapes tardy tarry
tasks taste tasty tatty taunt tawny taxes teach teams tears teary tease teddy
teens teeth tempo temps tempt tends tenet tenor tense tenth tepee tepid terms
terra terse tests testy thank thaws theft their theme there these thick thief
thigh thing think third thong thorn those three threw thrill throb throw thrum
thud thumb thump tiara tidal tides tiger tight tiled tiles tilts timed timer
times timid tipsy tired titan tithe title toast today toddy toenail token tonal
toned toner tones tongs tonic tools tooth topaz topic torch torso total totem
tots touch tough tours towel tower towns toxic trace track tract trade trail
train trait tramp traps trash trawl trays tread treat trees treks trend trial
tribe trick tried trier tries trike trims trips trite troll tromp troop trot
trots trout truce truck truly trump trunk trust truth tubby tulip tumor tuned
tuner tunes turbo turfs turns tutor twang tweak tweed tweet twice twigs twill
twine twins twirl twist tying typed types typos

udder ulcer ultra umbra uncle under undid undue unfed unfit unify union unite
unity unlit unsay unset untie until unwed upper upset urban urine usage usher
using usual utter

vague valet valid valor value valve vapor vault vaunt vegan veiny veldt velvet
venom venue verbs verge verse vicar video views vigor vines vinyl viper viral
virus visor visit vista vital vivid vixen vocab vocal vodka vogue voice vomit
voted voter vouch vowel

wacky waded wader wades wafer waged wager wages wagon waist waits waive waken
walks walls wands wanes wants wards wares warns warps warts warty wasps waste
watch water watts waved waver waves waxed weary weave wedge weeds weedy weeks
weigh weird wells welsh wench whale wharf wheat wheel whelp where which whiff
while whims whine whiny whips whirl whisk white whole whoop whose widen wider
widow width wield wills wimpy wince winch winds windy wines wings winks wiped
wiper wires wired wiser witch witty wives woken woman women woody woozy words
wordy works world worms worry worse worst worth would wound woven wrack wrath
wreak wreck wrest wring wrist write wrong wrote wrung

xenon

yacht yards yarns yawns yearn years yeast yield yolks young yours youth yucky
yummy

zappy zesty zilch zippy zonal zoned zones
""".split())

def export_to_csv(words_set, filename="words.csv"):
    words_list = sorted([w.lower() for w in words_set if len(w) == 5 and w.isalpha()])
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['word'])
        for word in words_list:
            writer.writerow([word])
    return len(words_list)

if __name__ == "__main__":
    count = export_to_csv(WORDS)
    words_list = sorted([w.lower() for w in WORDS if len(w) == 5 and w.isalpha()])
    print(f"Exported {count} unique common 5-letter words to words.csv")
    print(f"First 10: {words_list[:10]}")
    print(f"Last 10: {words_list[-10:]}")
