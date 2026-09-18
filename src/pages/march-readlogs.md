# March readlogs

### Ben Barres autobiography, trying focused ultrasound, floating in sf peninsula, slightly deadish

*Source: [feralscholars.substack.com/p/march-readlogs](https://feralscholars.substack.com/p/march-readlogs) — noesis*

---

![Ben Barres autobiography cover](/assets/images/readlogs/march-01-ben-barres.png)

The author wants to be referred to using gender-neutral terms. *If I were a fish and you caught me you'd say "Look at that fish", shimmering in the sun, such a rare one can't believe that you caught one!*

[Autobiography of a transgender scientist – Ben Barres](https://transreads.org/wp-content/uploads/2021/07/2021-07-17_60f33d480e715_TheAutobiographyofaTransgenderScientistbyBenBarresz-lib.org_.pdf)

## 1. Upbringing

Ben's mom and dad was not a compatible pair; Mom was happy yet often irritable due to the lack of sleep, possessing high intelligence. She had been streamed into secretariats to only take up a mathematics degree later — textbook Guzey's cursed talent "parents failed in life". Ben had a first agentic inflection point at 14, when he rejected going to church.

## 2. Ben's years at MIT

Ben took up numerous courses at various universities in late high school, including getting into computer programming early. Initially, there was lots of fluid exploration → excellence. This then solidified into a sure direction of neurobiology research, where the process of specialization is gradual: Choosing between the dichotomy of clinical vs research, then, experimental vs computational vs theoretical, followed by patch clamping techniques, then the substrate of glial cells, and their ion channel activations. In the failed experiments are a lot of methodology groundwork.

Undermentorship prevented Ben from progressing in his career. Profs did not encourage Ben when he successfully solved a question.

> To my dismay, he sneered at me and said that my boyfriend must have solved it for me. I was offended because he was unfairly and wrongly accusing me of cheating. It was many years before I realized that his meaning was deeply sexist — he just couldn't believe a woman had solved the problem when so many men had been unable to

He was rejected by numerous labs, and the one ran by fem professor did not provide much mentorship. Pattern! Gender non-conforming people are often undermentored and believing they're less skilled! After major failing, during an extended Happy Weekend, Ben chooses to directly head back to Boston rather than staying at the beach, not because it is optimal, because they wanted it.

## 3. Grad school

**Experimentalist failing:** Too many experiments have been done with data, yet no papers have been written by their 4th year of phd, contrast this to the more familiar theorist fail, where ideas were bottlenecked by execution.

> One night in my third year I used a dounce homogenizer to isolate some nuclei that I labeled with a fluorescent nuclear dye so that I could visualize them and try to patch onto them to see if there were any ion channels in the nuclear membrane. I did the experiment late at night so David would not catch me, but all of a sudden, around 10 p.m., he suddenly appeared. He asked me what I was doing. I said, "Nothing, just the same old thing." He said, "Let me see." He sat down at the microscope, looked through the eyepieces, and . . . I was busted! He was silent for a minute. I could see he was not happy. He looked at me and said, "You know, someday, if you ever learn how to focus, you are going to be a great scientist." … By my fourth year, when no papers had yet appeared, David banned me from the lab. He sent me home with a computer and told me not to come back to the lab until I had written at least one paper.

By the time of their PhD defense, it seemed like a huge body of work had accumulated around glial cells that were "big questions carried out a small step" groundwork. This zoom-out gives perspective, placing the body of work people usually do over several years in the megastructure of science. Moonlighting while doing research at the same time led to crash outs. He was funded by a scholarship in undergrad, now got a yearly salary, which contributed to more total sleep time and sharp rise in performance. New grad students are often bad at choosing mentors, and doing this could set back one's career. He was initially rejected by Martin, who later said yes to Ben being a postdoc after asking several times.

> During my first year in Martin's lab, I did not listen much to his advice. I worked hard and long hours on at least six different projects. One by one, each of these projects failed.

Ben notes people who accelerate and skip their postdocs have often been found working on the same problems as before. They tend to be risk averse. It takes decades to understand the infrastructure of science and successfully execute + ideate as one's skills allow them to.

## 4. Stanford

The Harvard argumentation style is asking questions on the verge of destruction. Martin trained people to focus on the bigger picture by asking "what is your biggest takeaway". Now that I reflect, my systems-thinking instincts could've very much came from nurture! On the flip side, some people might've been trained to deliver technical details during childhood, if engineer parents had been asked "how did you implement it?" or, "why did you design the system this way?"

Counteroffers. It can take 2 years for an offer to materialize. things move fine-grained and slow.

Very common for young investigators who hadn't established themselves prior to be met with skepticism. I guess that's why people go for fellowships and awards as a shortcut. Ben's first five years were very tough in getting grant support; Grant scores and NIH only accepted grants scoring in the top 7% then.

## 5. Transitioning

> I strongly feared that a transition would end my career. For about a week, I was almost unable to sleep from the stress as I pondered whether I should transition or commit suicide

Ben sent out an open letter providing context of gender dysphoria. They're trans because exposure to male hormones during pregnancy, mullerean agenesis, breast cancer coincidentally led to top surgery. Even as a trans guy, he advocated for women's education.

---

## Bypassing spike sorting

[Bypassing spike sorting](https://www.sciencedirect.com/science/article/pii/S0896627319304283) was an unusual read.

1. The authors derive a specific scaling relation where the squared distortion (e²) of a neural manifold scales linearly with the expression 1/M ln(CT/τ). In this formula, *M* is the number of channels, *C* is the number of conditions, *T* is the trial duration, and *τ* is the temporal autocorrelation length. But I think it was not clear this relation generalizes from the motor cortex which is relatively well studied and rhythmic to more sensory-driven and associative areas.
2. The authors frame a single electrode recording as a random projection of a high-dimensional neural state into a lower-dimensional space, by applying the Johnson Lindenstrauss lemma from statistics into neuroscience! They argue that the spiking activity on a single electrode — composed of a linear combination of isolatable units plus "hash" — is not "corrupted" data, but rather a valid, noisy projection that preserves the geometry of the low-dimensional manifold. What is the biological nature of this hash? Can we productively use tossed out data to recover neural information?

The classic estimation process may had stopped serving useful estimations in motor BCIs.

> "First, the process of spike sorting is both time consuming and inexact, with significant variability between experts (Wood and Black, 2008). For a typical experiment composed of many hours of neural recordings, an expert human sorter may spend several hours to make hundreds or thousands of small and uncertain decisions to manually sort spikes on a single 100-channel electrode array (e.g., Utah array [Maynard et al., 1997]). New high-channel-count recording technologies like Neuropixels are becoming available that will enable recording from thousands to millions of channels simultaneously. A dataset composed of 1,000 channels could take over 100 h to hand sort, with no ground truth available to validate results."

The base level of useful analysis is not necessarily, a singular neuron.

> "Second, in real-world experimental conditions, chronically implanted multielectrode arrays in animal models or in humans often feature many channels with neural activity that cannot be isolated into single neurons (e.g., Pandarinath et al., 2015) by either manual or automated sorting."

---

## At the Mountains of Madness (Gou Tanabe)

[At the Mountains of Madness, graphical interpretation by Gou Tanabe](https://www.goodreads.com/book/show/42875804-h-p-lovecraft-s-at-the-mountains-of-madness-volume-1) — The narrative structure of cosmic horror is a bit like Chinese communication, so I wonder if Chinese audiences are quickly bored by the book… I was just here for the graphics to feel the texture of language, which I rate a 5/5. And, why did [dream cycles](https://lovecraft.fandom.com/wiki/Dream_Cycle) not directly inspire inception?

> "About Antarctica, where life and death, space and time have made black and blasmphemous alliances in the unknown epochs since matter first writhed and swam on the planet's scarce cooled crust" For some reason this Tanabe interpretation is European tainted…

![Mountains of Madness page A](/assets/images/readlogs/march-02-mountains-of-madness-a.jpeg)

![Mountains of Madness page B](/assets/images/readlogs/march-03-mountains-of-madness-b.jpeg)

---

## Sleep & brain regions

Hypocretin-1 responsible for wakefulness in the C process of circadian rhythm. There is a parietal-temporal-prefrontal loop for producing [sleep spindles](https://pmc.ncbi.nlm.nih.gov/articles/PMC3183424/), a feedback oscillator. *Jingles*. A activates B. B activates C. C inhibits B 🎶. There is the shared upstream in the fronto-limbic brain for depression, insomnia, PTSD. *Metacommentary: [Types of sleep papers.](https://x.com/michaelgrandner/status/1389090295757762560)*

Brain regions could be thought of as projector nodes and integrator nodes. Continuing to parse [SNEL's list](https://cpandar.github.io/labmanual/) of comp neuro papers (I didn't know that Dario Amodei wrote comp neuro papers too), statistical techniques including LORETA which were mostly symmetric. Peeking inside my friend's brain from all of their fMRI data…

![Projector vs integrator node diagram](/assets/images/readlogs/march-04-brain-projector-integrator.png)

---

## ❄️❄ White Nights ❄️❄

[White Nights](https://www.gutenberg.org/files/36034/36034-h/36034-h.htm)

When I was extremely lonely during 2020, I also remember info-dumping people like the protagonist does here for pages. I'm no longer lonely and I just dump publically.

![Nastenka from Dostoevsky's novella White Nights — watercolor](/assets/images/readlogs/march-05-nastenka-watercolor.jpeg)

> "Do you know," she began, "I feel a little vexed that you are not in love with me? There's no understanding human nature! But all the same, Mr. Unapproachable, you cannot blame me for being so simple; I tell you everything, everything, whatever foolish thought comes into my head."

![Story pin image](/assets/images/readlogs/march-06-story-pin.jpeg)

---

## March events

**3 hours of focused ultrasound.** I'm hopeful about transcranial ultrasound stimulation having tried it for myself for a visual attention study at the Lucas Center, reaching deeply inside the brain is cool!

**Listening to Surya Ganguli talk about statistical mechanics.** Interesting application of physics in neuroscience… Then I read about random matrix theory, replica methods at home. I would also need to read this [compressed sensing paper](https://www.annualreviews.org/content/journals/10.1146/annurev-neuro-062111-150410) and also [statistical mechanics of complex neural systems and high dimensional data](https://arxiv.org/abs/1301.7115).

**Periodic labs colloquium.** This startup is a whirlwind spreading too thin (reminds me of this [Kasane Teto](https://www.youtube.com/watch?v=dbfFDAHmP_c) song)! People asked about Ekin about his robots, and of course I asked about the chemputer, and what came out of the language-model scanning electron microscope optimization, he didn't provide answers to. Ekin does suggest rewriting legacy scientific software in modern languages: Translating electrodynamics packages in C++ into Jax.

On the discovery of superconductor graph there are several "trails" of families of superconductors. Once a trail had been identified, discover the next superconductor was relatively easy. 1.2 superconductors were discovered per year over 30 years… there are decades of gaps but the process could be replicated in a day.

**Comsol multiphysics workshop.** A one-size-fits all solution that is crazy expensive…

**Jennifer Doudna lecture.** AI generated TnpBs preserve enzyme dynamics, but have new RNA/DNA contacts added, much analogous to artefacts in AI slop.

**Appearing at MAA.**

**Eugene Izhikevich dinner.** Deeply human, he was sharing the joys of vibecoding in cursor, running a one-man startup. He proceeded to recommend thinking about what is the Adam Optimizer for spiking neural networks.

**Free Lunch at Google HQ!!!** Thanks to Svitlana.

**Stumbled into PhD defense re: the great ungulates of CS by Dr. Xavier Gonzalez.**

I feel sick (Just fucking try it, I tried it) In a spotlight shaped like a spiral. [I still feel sick!](https://www.youtube.com/watch?v=reJm3MRnevw) Several weeks of stress turning into nausea/fevers, aye yai yai… This is a friendly reminder to take N-Acetyl Cysteine and choline; Euler took 10 years to prove the Basel series multiple times while he was becoming blind. Sounds trite, but, from experience, years of physical sickness is not a reason to give up.

![Daily reminder on my wall](/assets/images/readlogs/march-07-daily-reminder.png)

*daily reminder on my wall*

![Dostoyevsky quote card](/assets/images/readlogs/march-08-dostoyevsky-quote.jpeg)

"I am a sick [person]... I am a spiteful [person]." Mental monologue begins yearning for Dostoyevsky, "I am an unpleasant [person]. I think my liver is diseased. However, I don't know beans about my disease, and I am not sure what is bothering me. I don't treat it and never have, though I respect medicine and doctors. Besides, I am extremely superstitious, let's say sufficiently so to respect medicine. (I am educated enough not to be superstitious, but I am.) No, I refuse to treat it out of spite. You probably will not understand that."

![Drawing of a kitchen sink with cabinets and utensils hanging on the wall](/assets/images/readlogs/march-09-kitchen-sink.jpeg)

"I'm lying in my bed five flights up and my day which nothing interrupts is like a clock face without hands. Just as a thing that has long been lost is found one morning back safe and sound where it belongs and looking almost newer than it did at the time it went missing just as if someone had been taking care of it: so here and here on my blanket lie things that were lost in my childhood and are now like new. All my lost fears are here once more."

![Misc note](/assets/images/readlogs/march-10-misc.png)

Liked reading partially: Snow Crash, Project Hail Mary

Other: cultivating chosen friendships, reconciling conflicts, being awkward and sincere along 1 – 3 closest friends.

![Two white birds in the middle of a forest next to a body of water](/assets/images/readlogs/march-11-two-birds.jpeg)
