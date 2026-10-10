/* ============================================================
   FRISE CHRONOLOGIQUE — événements
   ------------------------------------------------------------
   Les dates s'écrivent comme dans les archives : "014.M31" (an 14 du 31ᵉ millénaire),
   "M36" (tout le millénaire), ou "~M30". Les dates du M42 sont approximatives (la chronologie
   officielle y reste volontairement floue). debut/fin : début et fin (fin facultative).
   piste  : imperium · chaos · xenos   (la ligne où s'affiche l'événement)
   page   : dossier du Codex · carte : balise de la carte · lire : thème du Cartographe
   Les « temps mythiques » (avant l'humanité) sont dans FRISE_MYTHES.
   ============================================================ */
window.FRISE_MYTHES = [
  { nom:"La Guerre dans les Cieux", quand:"≈ 60 millions d'années", piste:"xenos", page:"evt-guerre-cieux.html", lire:"necrons",
    txt:"Les Anciens et leurs créations affrontent les Nécrontyr et leurs maîtres C'tan. La guerre façonne la galaxie, puis les Nécrons s'endorment dans leurs tombeaux." },
  { nom:"L'Empire Aeldari", quand:"Antiquité → M30", piste:"xenos", page:"evt-empire-aeldari.html", lire:"aeldari",
    txt:"Héritiers des Anciens, les Aeldari bâtissent la plus grande civilisation de la galaxie — et sombrent peu à peu dans la décadence." }
];

window.FRISE = [
  { id:"age-sombre", nom:"Âge Sombre de la Technologie", debut:"M15", fin:"M25", piste:"imperium", page:"evt-age-tenebres.html",
    txt:"L'humanité colonise la galaxie grâce aux STC et aux machines pensantes. L'apogée technologique avant la longue nuit." },
  { id:"discorde", nom:"Âge de la Discorde", debut:"M25", fin:"M30", piste:"imperium", page:"evt-discorde.html",
    txt:"Tempêtes warp, révolte des machines et apparition des psykers : la civilisation humaine s'effondre monde après monde." },
  { id:"chute-aeldari", nom:"Chute des Aeldari", debut:"~M30", piste:"chaos", page:"evt-chute-aeldari.html", carte:"oeil", lire:"aeldari",
    txt:"La décadence aeldari donne naissance à Slaanesh. L'empire est anéanti et l'Œil de la Terreur s'ouvre." },
  { id:"unification", nom:"Guerres d'Unification", debut:"~M30", piste:"imperium", page:"evt-unification.html", carte:"terra",
    txt:"L'Empereur se révèle et réunifie Terra sous sa bannière, avec ses Guerriers-Tonnerre." },
  { id:"grande-croisade", nom:"La Grande Croisade", debut:"798.M30", fin:"005.M31", piste:"imperium", page:"evt-grande-croisade.html", lire:"heresie",
    txt:"L'Empereur et ses Primarques réunissent un million de mondes. Horus est nommé Maître de Guerre à la fin de la Croisade." },
  { id:"nikaea", nom:"Concile de Nikaea", debut:"~001.M31", piste:"imperium", page:"evt-nikaea.html", lire:"thousand-sons",
    txt:"L'Empereur interdit l'usage de la sorcellerie aux Légions. Magnus le Rouge plaide en vain." },
  { id:"isstvan", nom:"Trahison d'Isstvan", debut:"005.M31", fin:"006.M31", piste:"chaos", page:"evt-heresie.html", lire:"heresie",
    txt:"Horus purge les loyalistes de ses Légions sur Isstvan III, puis tend un piège mortel aux Légions loyales sur Isstvan V." },
  { id:"heresie", nom:"L'Hérésie d'Horus", debut:"005.M31", fin:"014.M31", piste:"chaos", page:"evt-heresie.html", lire:"heresie",
    txt:"Neuf Légions trahissent l'Empereur. La guerre civile embrase toute la galaxie." },
  { id:"calth", nom:"Bataille de Calth", debut:"~007.M31", piste:"chaos", page:"primarque-guilliman.html", lire:"ultramarines",
    txt:"Les Word Bearers frappent les Ultramarines par surprise dans le système de Calth." },
  { id:"siege", nom:"Siège de Terra", debut:"014.M31", piste:"imperium", page:"evt-siege-terra.html", carte:"terra", lire:"siege-terra",
    txt:"Horus assiège le Palais Impérial. Il est vaincu, mais l'Empereur est placé sur le Trône d'Or." },
  { id:"chatiment", nom:"Le Châtiment & la Seconde Fondation", debut:"014.M31", fin:"021.M31", piste:"imperium", page:"evt-chatiment.html",
    txt:"Les traîtres sont repoussés vers l'Œil de la Terreur. Le Codex Astartes divise les Légions en Chapitres." },
  { id:"croisades-noires", nom:"Les Croisades Noires", debut:"M31", fin:"999.M41", piste:"chaos", page:"evt-croisades-noires.html", carte:"cadia", lire:"black-legion",
    txt:"Treize grandes offensives d'Abaddon depuis l'Œil de la Terreur, jusqu'à la chute de Cadia." },
  { id:"bete", nom:"Guerre de la Bête", debut:"544.M32", fin:"548.M32", piste:"xenos", page:"evt-guerre-bete.html", lire:"orks",
    txt:"Une Waaagh! d'une ampleur inédite frappe jusqu'aux abords de Terra." },
  { id:"nova-terra", nom:"Interrègne de Nova Terra", debut:"M34", fin:"M36", piste:"imperium", page:"evt-interregne.html",
    txt:"Un schisme coupe l'Imperium en deux pendant des siècles." },
  { id:"apostasie", nom:"Âge de l'Apostasie", debut:"~M36", piste:"imperium", page:"evt-apostasie.html", lire:"sororitas",
    txt:"Le Haut Seigneur Goge Vandire plonge l'Imperium dans le Règne du Sang. Les Sœurs de Bataille naissent de sa chute." },
  { id:"gothique", nom:"Guerre Gothique", debut:"~140.M41", piste:"chaos", page:"evt-croisades-noires.html", carte:"gothic",
    txt:"Abaddon tente de s'emparer des Forteresses Noires dans le secteur Gothique." },
  { id:"armageddon-1", nom:"Première Guerre d'Armageddon", debut:"444.M41", piste:"chaos", page:"evt-m41.html", carte:"armageddon",
    txt:"Angron et ses démons envahissent Armageddon, repoussés par les Space Wolves et les Grey Knights." },
  { id:"behemoth", nom:"Flotte-ruche Béhémoth", debut:"745.M41", piste:"xenos", page:"flotte-behemoth.html", carte:"macragge", lire:"tyranides",
    txt:"Première grande invasion tyranide : les Ultramarines la brisent à Macragge, au prix de leur 1ʳᵉ compagnie." },
  { id:"armageddon-2", nom:"Seconde Guerre d'Armageddon", debut:"941.M41", piste:"xenos", page:"regiment-armageddon.html", carte:"armageddon", lire:"orks",
    txt:"Ghazghkull envahit Armageddon. Yarrick organise la résistance ; Mephiston naît dans les ruines de la ruche Hadès." },
  { id:"kraken", nom:"Flotte-ruche Kraken", debut:"~992.M41", piste:"xenos", page:"flotte-kraken.html", carte:"ichar", lire:"tyranides",
    txt:"Une nouvelle flotte-ruche frappe l'Est galactique : Ichar IV tient de justesse." },
  { id:"armageddon-3", nom:"Troisième Guerre d'Armageddon", debut:"998.M41", piste:"xenos", page:"xenos-ghazghkull.html", carte:"armageddon", lire:"orks",
    txt:"Ghazghkull revient avec la plus grande Waaagh! de l'histoire. Helsreach est l'un de ses théâtres." },
  { id:"leviathan", nom:"Flotte-ruche Léviathan", debut:"~997.M41", fin:"~001.M42", piste:"xenos", page:"flotte-leviathan.html", carte:"baal", lire:"blood-angels",
    txt:"Léviathan surgit par en dessous du plan galactique et assiège Baal." },
  { id:"cadia", nom:"Chute de Cadia", debut:"999.M41", piste:"chaos", page:"evt-grande-faille.html", carte:"cadia", lire:"black-legion",
    txt:"La Treizième Croisade Noire brise la Porte de Cadia. La Grande Faille s'ouvre dans son sillage." },
  { id:"faille", nom:"La Grande Faille", debut:"999.M41", piste:"chaos", page:"evt-grande-faille.html", carte:"faille", lire:"m42",
    txt:"La Cicatrix Maledictum déchire la galaxie et isole l'Imperium Nihilus." },
  { id:"indomitus", nom:"Croisade Indomitus", debut:"999.M41", fin:"~012.M42", piste:"imperium", page:"evt-indomitus.html", carte:"macragge", lire:"m42",
    txt:"Ressuscité, Roboute Guilliman lance la plus grande croisade depuis l'Hérésie, appuyée par les Primaris." },
  { id:"ere-indomitus", nom:"L'Ère Indomitus", debut:"000.M42", fin:"~040.M42", piste:"imperium", page:"chrono-indomitus.html", lire:"m42",
    txt:"Le présent du jeu : un Imperium coupé en deux, assiégé sur tous les fronts, mais qui retrouve ses Primarques." }
];

/* ---------- Ajouts : Hérésie en détail ---------- */
window.FRISE = window.FRISE.concat([
  { id:"horus-maitre", nom:"Horus nommé Maître de Guerre", debut:"~000.M31", piste:"imperium", page:"primarque-horus.html", lire:"heresie",
    txt:"Après la victoire d'Ullanor, l'Empereur regagne Terra et confie le commandement de la Grande Croisade à Horus." },
  { id:"davin", nom:"La chute d'Horus sur Davin", debut:"~004.M31", piste:"chaos", page:"primarque-horus.html", lire:"heresie",
    txt:"Gravement blessé sur la lune de Davin, Horus reçoit une vision qui le détourne de son père." },
  { id:"prospero", nom:"L'incendie de Prospero", debut:"~005.M31", piste:"imperium", page:"legion-thousand-sons.html", carte:"prospero", lire:"thousand-sons",
    txt:"Les Space Wolves et les Custodes s'abattent sur Prospero, monde des Thousand Sons, qui est réduit en cendres." },
  { id:"secundus", nom:"Imperium Secundus", debut:"~009.M31", fin:"~012.M31", piste:"imperium", page:"primarque-guilliman.html", carte:"macragge", lire:"ultramarines",
    txt:"Coupé de Terra par la Tempête de Ruine, Guilliman bâtit un second empire autour de Macragge." },
  { id:"beta-garmon", nom:"Guerre de Beta-Garmon", debut:"~010.M31", fin:"~012.M31", piste:"chaos", page:"univers-titans.html", lire:"mechanicus",
    txt:"La plus grande bataille de Titans de l'histoire, sur la route de Terra." },
  { id:"fondation-2", nom:"Seconde Fondation", debut:"~021.M31", piste:"imperium", page:"imperium-astartes.html", lire:"debutant",
    txt:"Le Codex Astartes divise les Légions loyalistes en Chapitres d'un millier de guerriers." },
  { id:"cn-1", nom:"Première Croisade Noire", debut:"781.M31", piste:"chaos", page:"evt-croisades-noires.html", carte:"oeil", lire:"black-legion",
    txt:"Première offensive d'Abaddon hors de l'Œil de la Terreur." },

/* ---------- Le long déclin ---------- */
  { id:"fondation-maudite", nom:"La Fondation Maudite", debut:"~M36", piste:"imperium", page:"imperium-astartes.html",
    txt:"La XXIᵉ Fondation produit des Chapitres à la gène-semence instable, frappés de mutations et de malédictions." },
  { id:"thor", nom:"Réforme de Sebastian Thor", debut:"~M36", piste:"imperium", page:"evt-apostasie.html", lire:"sororitas",
    txt:"Après la chute de Vandire, Sebastian Thor réforme l'Ecclésiarchie et lui interdit d'entretenir des « hommes en armes »." },

/* ---------- 41ᵉ millénaire ---------- */
  { id:"macharius", nom:"Croisade Macharienne", debut:"392.M41", fin:"399.M41", piste:"imperium", page:"evt-m41.html", carte:"macharia", lire:"garde",
    txt:"Le seigneur solaire Macharius reconquiert un millier de mondes en sept ans." },
  { id:"damocles", nom:"Croisade du Golfe de Damoclès", debut:"742.M41", fin:"745.M41", piste:"xenos", page:"xenos-tau.html", carte:"damocles", lire:"tau",
    txt:"L'Imperium attaque l'Empire T'au naissant ; la guerre s'achève par une paix inattendue face à l'arrivée des Tyranides." },
  { id:"sabbat", nom:"Croisade des Mondes de Sabbat", debut:"~755.M41", fin:"~M41", piste:"imperium", page:"regiment-tanith.html", carte:"sabbat", lire:"garde",
    txt:"Une croisade de plusieurs décennies pour reprendre les Mondes de Sabbat à l'Archennemi. Les Fantômes de Gaunt y combattent." },
  { id:"vraks", nom:"Siège de Vraks", debut:"813.M41", fin:"830.M41", piste:"chaos", page:"regiment-krieg.html", carte:"vraks", lire:"garde",
    txt:"Dix-sept ans de guerre de tranchées : le Corps de la Mort de Krieg écrase la rébellion d'un monde-arsenal." },
  { id:"badab", nom:"Guerre de Badab", debut:"901.M41", fin:"912.M41", piste:"chaos", page:"champion-huron.html", carte:"badab", lire:"carcharodons",
    txt:"Le Chapitre des Astral Claws de Lufgt Huron entre en sécession. Plusieurs Chapitres loyalistes, dont les Carcharodons, mettent fin à la rébellion." },
  { id:"huron-maelstrom", nom:"Naissance des Red Corsairs", debut:"~912.M41", piste:"chaos", page:"champion-huron.html", carte:"maelstrom",
    txt:"Vaincu, Huron s'enfuit dans le Maelström et y fonde la plus grande flotte pirate renégate de la galaxie." },
  { id:"golgotha", nom:"Capture de Yarrick à Golgotha", debut:"~950.M41", piste:"xenos", page:"heros-yarrick.html", carte:"golgotha", lire:"orks",
    txt:"Le commissaire Yarrick tombe aux mains de Ghazghkull, qui le relâche pour s'assurer un adversaire digne de lui." },
  { id:"iyanden", nom:"Ravage d'Iyanden", debut:"~991.M41", piste:"xenos", page:"craftworld-iyanden.html", lire:"aeldari",
    txt:"La Flotte-ruche Kraken dévaste le vaisseau-monde d'Iyanden, qui ne survit qu'en éveillant ses morts." },
  { id:"taros", nom:"Campagne de Taros", debut:"~998.M41", piste:"xenos", page:"xenos-tau.html", carte:"tau", lire:"tau",
    txt:"La Garde impériale tente de reprendre aux T'au un monde désertique stratégique." },
  { id:"crusade-13", nom:"Treizième Croisade Noire", debut:"~999.M41", piste:"chaos", page:"evt-croisades-noires.html", carte:"cadia", lire:"black-legion",
    txt:"Abaddon lance la plus grande de ses croisades. Elle s'achève par la destruction de Cadia." },

/* ---------- Ère Indomitus ---------- */
  { id:"guilliman", nom:"Résurrection de Guilliman", debut:"~999.M41", piste:"imperium", page:"primarque-guilliman.html", carte:"terra", lire:"ultramarines",
    txt:"Ressuscité grâce à Yvraine et aux Aeldari, Roboute Guilliman revient à Terra et devient Seigneur Commandant de l'Imperium." },
  { id:"primaris", nom:"Révélation des Primaris", debut:"~999.M41", piste:"imperium", page:"heros-cawl.html", lire:"m42",
    txt:"Belisarius Cawl dévoile les Space Marines Primaris, fruit de dix mille ans de travail." },
  { id:"ynnari", nom:"Naissance des Ynnari", debut:"~999.M41", piste:"xenos", page:"xenos-yvraine.html", lire:"aeldari",
    txt:"Yvraine, émissaire du dieu des morts Ynnead, rassemble les Aeldari autour d'une nouvelle foi." },
  { id:"devastation-baal", nom:"Dévastation de Baal", debut:"~999.M41", piste:"xenos", page:"chapitre-blood-angels.html", carte:"baal", lire:"blood-angels",
    txt:"Dante et les successeurs de Sanguinius défendent Baal contre Léviathan jusqu'à l'extrême limite." },
  { id:"plague-wars", nom:"Guerres de la Peste", debut:"~005.M42", piste:"chaos", page:"legion-death-guard.html", carte:"macragge", lire:"death-guard",
    txt:"Mortarion et la Death Guard s'abattent sur Ultramar. Guilliman revient défendre son domaine." },
  { id:"vigilus", nom:"Guerre de Vigilus", debut:"~012.M42", piste:"chaos", page:"evt-indomitus.html", carte:"vigilus", lire:"m42",
    txt:"Orks, cultes genestealers puis Black Legion se disputent Vigilus, l'un des rares passages stables à travers la Grande Faille." },
  { id:"pariah-nexus", nom:"Le Nexus Paria", debut:"~020.M42", piste:"xenos", page:"dynastie-szarekhan.html", carte:"pariah", lire:"necrons",
    txt:"Des Nécrons répandent un phénomène qui éteint l'âme des humains sur des systèmes entiers." },
  { id:"lion-retour", nom:"Retour du Lion", debut:"~025.M42", piste:"imperium", page:"primarque-lion.html", lire:"dark-angels",
    txt:"Le Lion El'Jonson s'éveille et reprend la tête de ses fils dans une galaxie qu'il ne reconnaît plus." },
  { id:"votann", nom:"Expansion des Ligues de Votann", debut:"~015.M42", piste:"xenos", page:"xenos-votann.html",
    txt:"Les Kin de Votann se montrent de plus en plus souvent dans une galaxie fracturée, au gré de leurs contrats." },
  { id:"leviathan-retour", nom:"Retour de Léviathan", debut:"~030.M42", piste:"xenos", page:"flotte-leviathan.html", lire:"tyranides",
    txt:"La Flotte-ruche Léviathan frappe de nouveau, sur un front qui menace l'Imperium tout entier." }
]);
