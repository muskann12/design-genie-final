'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { HiClipboardCopy, HiCheck } from "react-icons/hi";

const mainCategories: Record<string, Record<string, string[]>> = {
  "T-Shirts": {
    "T-Shirt Design Prompts": [
      "A minimalist Earth illustration with 'Protect Our Planet' in stylish typography.",
      "A tree with roots forming a recycling symbol.",
      "A mountain landscape with 'Nature is Home' in handwritten script.",
      "An abstract pattern of green leaves and blue water waves.",
      "A cute Earth character wearing sunglasses and smiling.",
      "A minimal line-art whale with 'Save the Oceans' written beneath it.",
      "A vintage eco-conscious badge with 'Go Green, Stay Clean.'",
      "A futuristic eco-city with solar panels and wind turbines.",
      "A silhouette of a rainforest inside an animal shape.",
      "A watercolor-style tree growing inside a lightbulb.",
      "'FEARLESS' in glitch-style bold typography.",
      "The word 'HUSTLE' in a metallic 3D effect.",
      "'Dream Big' in retro neon-style typography.",
      "'GRIND MODE' with a shattered text effect.",
      "'SUCCESS' written in minimal, futuristic font.",
      "'Stay Wild' in a brush-stroke calligraphy style.",
      "'WORK HARD' written in a street graffiti-inspired font.",
      "'LIFE IS SHORT' inside a barcode-style design.",
      "'NO LIMITS' with 3D isometric typography.",
      "'BREAK THE RULES' in distorted, dynamic text."
    ],
    "Streetwear & Urban Fashion T-Shirt Designs 🏙": [
      "A graffiti-style spray paint can with neon splashes.",
      "A masked urban character with a hoodie and chains.",
      "A sneaker with a futuristic cyberpunk glow.",
      "A street-style monkey wearing sunglasses and headphones.",
      "Bold text saying 'No Rules' in a glitchy style.",
      "A roaring tiger with a chain around its neck.",
      "A city skyline at night with neon lights.",
      "An urban skater mid-air doing a trick.",
      "Hip-hop album covers with a unique color scheme.",
      "A cyberpunk-style gas mask with holographic reflections."
    ],
    "Motivational & Inspirational T-Shirt Designs ": [
      "'Stay Strong' in bold, brush-stroke typography.",
      "A mountain peak with 'Keep Climbing' written below.",
      "'Never Give Up' with a shattered effect.",
      "A rising sun with 'New Day, New Opportunities.'",
      "'One More Rep' for gym and fitness lovers.",
      "A lion's face with 'Lead with Strength.'",
      "An eagle soaring with 'Sky's the Limit.'",
      "'Dream Big, Work Hard' in a retro style.",
      "A silhouette of a runner with 'Push Beyond Limits.'",
      "'Progress Not Perfection' in minimal typography."
    ],
  },
  "Mugs": {
    "Minimalist & Aesthetic Mugs": [
      "A single-line abstract face drawing in black on a pastel background.",
      "A minimal coffee cup outline with 'But First, Coffee' in a sleek font.",
      "A soft watercolor mountain landscape in neutral tones.",
      "Delicate golden geometric shapes forming a unique pattern.",
      "A minimalist moon phase cycle with a calming color scheme.",
      "Simple hand-drawn leaves and floral elements in black and white.",
      "A minimalist cat stretching, designed in a sleek style.",
      "A monochrome palm tree silhouette with a beachy vibe.",
      "A line-art city skyline with a modern, clean look.",
      "The words 'Breathe & Relax' in soft, handwritten typography."
    ],
    "Streetwear & Urban Graffiti Mugs": [
      "Bold graffiti text saying 'Stay Real' with neon colors.",
      "A spray-paint effect with dripping ink typography.",
      "A hip-hop inspired skull wearing headphones in an urban style.",
      "An abstract graffiti explosion with vibrant shades.",
      "A skateboarder mid-air with a dynamic motion effect.",
      "The phrase 'Hustle Hard' with a street-style font.",
      "A colorful cityscape in a graffiti-inspired brushstroke style.",
      "A masked street artist with paint splatters.",
      "A gritty, urban 'No Limits' sign with bold typography.",
      "A stylized sneaker with abstract graffiti elements."
    ],
    "Cyberpunk & Futuristic Mugs": [
      "A neon cyberpunk skyline with glowing signs.",
      "A futuristic robot face with glowing blue eyes.",
      "A glitch-effect digital skull with cyber-inspired patterns.",
      "A holographic-style circuit board design.",
      "A neon samurai warrior with a futuristic city backdrop.",
      "A cyberpunk-style female character with neon streaks in her hair.",
      "A VR headset with a reflection of a futuristic world.",
      "A digital rain effect with a hacker-style aesthetic.",
      "A cyber ninja holding two glowing katanas.",
      "A 'Neon Dreams' typography design in a sci-fi style."
    ],
    "Space & Galaxy Mugs": [
      "A cosmic nebula with a dreamy color gradient.",
      "An astronaut floating in deep space with glowing planets.",
      "A stylized UFO abducting a cup of coffee.",
      "A futuristic city floating in outer space.",
      "A black hole with light being pulled in.",
      "An astronaut sitting on the moon, sipping coffee.",
      "The phrase 'Lost in Space' with planetary elements.",
      "A cosmic tiger with glowing star-like patterns on its fur.",
      "A stylized rocket ship launching into the galaxy.",
      "A dreamy pastel-colored milky way design."
    ],
    "Dark & Gothic Mugs": [
      "A dark skull with intricate floral details.",
      "A raven sitting on a tombstone under the moonlight.",
      "A gothic Victorian-style clock with vines creeping around it.",
      "A misty graveyard scene with a haunting glow.",
      "'Stay Creepy' in gothic calligraphy.",
      "A vampire biting a red rose with dark, dramatic lighting.",
      "An eerie candle-lit scene with shadowy figures.",
      "A gothic cathedral silhouette against a blood-red sky.",
      "An abandoned haunted house with crows flying around.",
      "A dark angel with glowing red eyes and black wings."
    ],
    "Pop Art & Retro Mugs": [
      "A pop art comic-style explosion with 'BOOM!' in the center.",
      "A vintage cassette tape with neon splashes.",
      "A classic 80s arcade machine with pixel art elements.",
      "Stylish retro sunglasses reflection of a beach.",
      "A neon-lit palm tree with a vaporwave aesthetic.",
      "A funky disco ball with a colorful glow.",
      "A pixelated heart with the phrase 'Level Up.'",
      "A retro television with static glitch effects.",
      "A 70s-style van with bright, psychedelic patterns.",
      "A vinyl record with a rainbow soundwave pattern."
    ],
    "Motivational & Inspirational Mugs": [
      "'Start Your Day Strong' with a rising sun.",
      "A mountain peak with 'Keep Climbing.'",
      "'Hard Work Pays Off' in bold typography.",
      "A roaring lion with 'Lead with Strength.'",
      "'Dream Big, Work Hard' in a futuristic font.",
      "An astronaut reaching for the stars with 'Limitless.'",
      "'Wake Up & Hustle' with an alarm clock icon.",
      "'Success is a Journey' with a road illustration.",
      "A cup of coffee with 'Fuel for Greatness.'",
      "'Focus, Grind, Repeat' in a stylish layout."
    ],
    "Anime & Manga Mugs": [
      "A chibi-style anime girl holding a coffee cup.",
      "A shadowy anime warrior with glowing red eyes.",
      "A cute anime fox drinking tea.",
      "A manga panel with 'Coffee First, Battles Later.'",
      "A cyberpunk anime character in a futuristic city.",
      "A samurai fox with cherry blossoms in the background.",
      "A kawaii-style coffee mug with a smiling face.",
      "'Shonen Energy' in fiery calligraphy.",
      "A mecha robot holding a giant coffee mug.",
      "A mysterious anime assassin with a katana."
    ],
  },
  "Caps": {
    "Streetwear & Hip-Hop Caps": [
      "Bold graffiti-style typography with a city skyline.",
      "A neon skull wearing headphones in a street art style.",
      "A roaring lion with a hip-hop crown and golden chains.",
      "A spray paint can with an explosion of colors.",
      "A skateboard with flames and a grunge texture.",
      "A hand holding a vintage microphone with hip-hop elements.",
      "A DJ turntable with musical notes floating around.",
      "The word 'VIBES' in a glitchy street-style font.",
      "A masked urban ninja with glowing blue eyes.",
      "A roaring tiger with lightning effects."
    ],
    "Gaming & Esports Caps": [
      "A futuristic gaming controller with neon effects.",
      "A pixelated 'GAME OVER' sign with a glitch effect.",
      "A cyberpunk-style gamer wearing a VR headset.",
      "A retro arcade machine with electric sparks.",
      "A first-person shooter character with a sniper rifle.",
      "A gaming mouse with a trail of speed effects.",
      "A battle royale-inspired skull with crossed swords.",
      "A 'Respawn Ready' text with a futuristic theme.",
      "A glowing power button symbol with circuit board elements.",
      "A joystick with a 'Level Up' banner."
    ],
    "Minimalist & Aesthetic Caps": [
      "A simple black and white mountain outline.",
      "A tiny crescent moon and stars in a minimal style.",
      "A single brushstroke forming a wolf silhouette.",
      "A small, delicate lotus flower sketch.",
      "A simple wave line representing the ocean.",
      "A geometric deer head with thin golden lines.",
      "The word 'Balance' in an elegant, thin font.",
      "An abstract spiral representing energy and focus.",
      "A clean, modern infinity loop design.",
      "A soft gradient sunset with a bird silhouette."
    ],
    "Motivational & Quote-Based Caps": [
      "'Dream Big, Hustle Hard' in a bold font.",
      "'Never Give Up' with a lightning bolt icon.",
      "'Born to Win' in a brushstroke-style font.",
      "'Stay Humble' with a simple underline.",
      "'Success is a Mindset' in a modern layout.",
      "'Fearless' with an eagle silhouette.",
      "'Grind Now, Shine Later' with a dynamic font.",
      "'Believe & Achieve' with a rising sun effect.",
      "'No Pain, No Gain' with a gym dumbbell icon.",
      "'Good Vibes Only' in a colorful aesthetic."
    ],
    "Pakistani Cultural & Patriotic Caps": [
      "The crescent and star with a calligraphy effect.",
      "A truck art-inspired floral pattern.",
      "The word 'Pakistan' in traditional Urdu script.",
      "Minar-e-Pakistan with a grunge effect.",
      "An artistic rendering of Quaid-e-Azam's portrait.",
      "The phrase 'Dil Dil Pakistan' in a stylized font.",
      "A cricket bat and ball with 'Game On!' written.",
      "A green and white wave pattern representing the flag.",
      "A truck art peacock with vibrant colors.",
      "A traditional ajrak pattern in a minimal style."
    ],
    "Nature & Wildlife Caps": [
      "A roaring bear in a mountain landscape.",
      "An eagle in flight with sharp details.",
      "A silhouette of a deer standing in a forest.",
      "A wolf howling at the moon.",
      "A hummingbird hovering near a flower.",
      "A tiger's eyes with a dark jungle background.",
      "A whale diving into the ocean.",
      "A desert scene with a lone cactus.",
      "A dolphin jumping over the waves.",
      "A cherry blossom branch with petals falling."
    ],
    "Futuristic & Sci-Fi Caps": [
      "A UFO hovering over a city at night.",
      "A robotic hand with glowing circuits.",
      "A cybernetic wolf with neon highlights.",
      "A planet with a futuristic space station.",
      "A time traveler stepping into a portal.",
      "A holographic skull with digital effects.",
      "A robotic samurai with energy swords.",
      "An astronaut floating in a galaxy.",
      "A futuristic city skyline with flying cars.",
      "An alien face with glowing eyes."
    ],
    "Abstract & Geometric Caps": [
      "A pattern of interconnected triangles.",
      "An optical illusion spiral.",
      "A broken glass effect with light reflections.",
      "A three-dimensional cube pattern.",
      "A maze-like geometric design.",
      "An abstract face formed with simple lines.",
      "A colorful, overlapping circle pattern.",
      "A futuristic grid with neon lights.",
      "A surreal melting clock design.",
      "A hypnotic vortex swirl."
    ],
  },
};

const Index = () => {
  const [expandedMainCategory, setExpandedMainCategory] = useState<string | null>(null);
  const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>([]);
  const [copiedPrompts, setCopiedPrompts] = useState<string[]>([]);

  const toggleMainCategory = (category: string) => {
    setExpandedMainCategory((prev) => (prev === category ? null : category));
    setExpandedSubCategories([]);
  };

  const toggleSubCategory = (subCategory: string) => {
    setExpandedSubCategories((prev) =>
      prev.includes(subCategory) ? prev.filter((cat) => cat !== subCategory) : [...prev, subCategory]
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompts((prev) => [...prev, text]);
      alert("Copied to clipboard!");
      setTimeout(() => {
        setCopiedPrompts((prev) => prev.filter((p) => p !== text));
      }, 2000);
    } catch (err) {
      alert("Failed to copy. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4c6489] to-[#001534] dark:from-neutral-900 dark:to-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <motion.div className="text-center space-y-4">
          <h1 className="text-4xl block  bg-clip-text bg-gradient-to-r from-gray-100 to-blue-400 sm:text-5xl font-extrabold text-neutral-100 dark:text-neutral-50">AI Prompt Collection</h1>
          <p className="text-neutral-100 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            Select a category to explore design prompts.
          </p>
        </motion.div>

        <motion.div className="grid gap-6">
          {Object.entries(mainCategories).map(([mainCategory, subCategories]) => (
            <motion.div key={mainCategory} className="rounded-2xl overflow-hidden border bg-gray-200 dark:bg-neutral-900 shadow-sm">
              <motion.button
                onClick={() => toggleMainCategory(mainCategory)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{mainCategory}</span>
                <motion.div animate={{ rotate: expandedMainCategory === mainCategory ? 180 : 0 }}>
                  <IoChevronDown className="w-5 h-5 text-neutral-500" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedMainCategory === mainCategory && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t">
                    <div className="grid gap-4 p-4">
                      {Object.entries(subCategories).map(([subCategory, prompts]) => (
                        <motion.div key={subCategory} className="rounded-xl border bg-white dark:bg-neutral-800">
                          <motion.button
                            onClick={() => toggleSubCategory(subCategory)}
                            className="w-full px-6 py-3 flex justify-between items-center text-left hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                          >
                            <span className="text-md font-medium text-neutral-900 dark:text-neutral-100">{subCategory}</span>
                            <motion.div animate={{ rotate: expandedSubCategories.includes(subCategory) ? 180 : 0 }}>
                              <IoChevronDown className="w-5 h-5 text-neutral-500" />
                            </motion.div>
                          </motion.button>

                          <AnimatePresence>
                            {expandedSubCategories.includes(subCategory) && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t">
                                <div className="grid gap-2 p-4">
                                  {prompts.map((prompt) => (
                                    <motion.div key={prompt} className="group p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex justify-between items-center gap-4">
                                      <span className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">{prompt}</span>
                                      <button
                                        onClick={() => copyToClipboard(prompt)}
                                        className="shrink-0 p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-white dark:hover:bg-neutral-800"
                                        aria-label="Copy to clipboard"
                                      >
                                        {copiedPrompts.includes(prompt) ? <HiCheck className="w-5 h-5" /> : <HiClipboardCopy className="w-5 h-5" />}
                                      </button>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
