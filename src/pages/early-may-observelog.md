---
layout: layouts/post.njk
title: "Early may observelog!"
date: 2026-05-15
author: "noesis"
category: lab
tags: ["readlogs"]
---
*Source: [feralscholars.substack.com/p/early-may-observelog](https://feralscholars.substack.com/p/early-may-observelog) — noesis*

---

![Header image — Lucas Center / Koret community neurosciences lab](/assets/images/readlogs/early-may-01-header.png)

Which took place at the Lucas Center and also the Koret community neurosciences lab.

## Study setup basics

In most studies, the resting state data is first collected through fMRI and MRI.

![MRI setup diagram](/assets/images/readlogs/early-may-02-mri-facility.png)

At the MRI scanning facility…

When I lied in the MRI machine, I heard 5 different octaves which performed a T1 echo sequence. My brain was not visibly different from most brains by rough inspection. I wondered about the white matter to gray matter ratios, *especially in trans individuals.*

![Study #2's setup](/assets/images/readlogs/early-may-03-study2-setup.jpeg)

*study #2's setup*

![Study #2: preparing the hair and ultrasound transducer](/assets/images/readlogs/early-may-04-transducer-prep.jpeg)

*study #2: preparing the hair and ultrasound transducer*

A high density EEG system was used in the 3rd study. Researchers used a 128 electrode cap and injected saline water into the electrodes with a pipette.

The baseline data collection involved a task that minimizes blinking with intermittent free-blinking breaks. This was subjectively painful. The research team was evidently speedrunning the study and was under immense pressure; The PI was considering skipping the lab meeting, offering me a chai latte.

Then there was the gold cup electrodes for recording during the task; My scalp was prepped with abrasive scrub to remove deadskin and gel for the gold. Three electrodes, blue, red, orange, were placed on the back of my head (ground, reference, signal) with several other electrodes. The gold electrodes are more conductive but are paired with an amplifier from the 1960s i.e. Grass technologies, which *kept* the noise in the data. This is contrasted with the other 128-electrode system that used an EGI amplifier from the 2010s with noise filtering.

Memory tasks were given in a screen usually involving a fixation cross in the center, and then a mirrored setup: The screen was divided into left, right, top and bottom regions where the stimuli could occur. Only one side of my brain was stimulated.

---

## The subtle and region-sensitive subjective experiences of FUS

It felt like being lightly zapped on the forehead. There was no temperature increase for more than 2 deg. Even though the transducer may be on for 40 mins, it is only operating at 10% duty cycle. The ultrasound was audible as it pulsed at designated frequencies: 5 Hz, 50 Hz and 500 Hz.

There were sham sessions which stimulated unrelated regions milimeters shallower/adjacent to targeted regions. For example in study #2, the focused ultrasound targeted the insula first in a later-revealed sham session, which *may* explain a reaction time speed up.

> My reaction time became noticeably & marginally faster and working memory increased to my own peak performance point.

However, the memory task in study #2 was moderate difficulty. I had came up with a heuristic before stimulation by mentally drawing paths and noting dots around the monitor to get the right answer. After stimulation, I feel cognitively effortless and ditched the heuristic, and likely performed still the same in terms of measured results. In study #2's 2nd session, the pulvinar (correct region) got targeted. this is a coordinator nuclei in the thalamus for visual attention, processing and filtering. Subjectively, I registered no noticeable effect.

**Wiggling.** The ultrasound had to pass through milimetres to hit study #3's target region: the LGN, just as large as the beam's focus, buried deep inside the brain. While I accidentally wiggled in my chair, I felt a phantom cold sensation in my throat. I suspect my vagus nerve was stimulated by accident through the incident beam. "Can focused ultrasound intentionally cause cognitive impairment?", @FemboyEE asked. This is practically demonstrated to be quite likely using present day set ups.

---

## Surprises in focused ultrasound

**Manual transducer placement was the bottleneck** in this study, taking 15 mins on average. Robotic arms are developed for TMS coils e.g. Axilum robotics, but could not generalize to the coregisteration step. Narrow robotics applications emerge frequently. 6 DOF arms like the LeRobot SO-101s are everywhere, one can vibecode a hello world to move all the servos in 10 mins, its a race to generalize as of 2026.

**Algernon-Gordon effects remain unstudied.** The postdocs weren't sure about *how* the focused ultrasound stimulation decays as a function of time, since they're focused on the what.

**Institutional arbitrage.** The study coordinator mentioned skipping their masters and directly going to a PhD program. Thus they needed to publish papers via a coordinator role. As it is currently May, I think the team was under immense pressure to finish the study before major deadlines. *The publish-or-perish pressure had caused me, an outsider, physical pain.*

![Errors analysis diagram](/assets/images/readlogs/early-may-05-errors-analysis.png)

Mistakes are more information than correct results. Through analyzing types of errors made at each stage in study #2 (directing + suppressing attention and manipulating information) among at least 30 participants, researchers could infer the ultrasound effects.

---

## Computing pendulum

Computing history has moved from large, centralized mainframes to distributed PCs back to the centralized cloud, followed by distributed local models so the models within the same enterprise can communicate quickly with each other. There appears to be a current swing in computing to specialization, evident in various GPUs, ASICs and aforementioned local models. At the Founders Inc.'s Physical AI hackathon this past weekend, people toasted bread and set tables with robotic arms. One team found it easy to drop bread into the toaster, but harder to "push down the toasting button" to refine the toaster pipeline. In robotics, the pendulum seems to be swinging towards generalization.

"Software ate the world". AI eats software. Hardware increases in relevance.

In an assembly line, whether in the cafeteria or in software, having the best people at the start is important. Shift left.

I noticed I had been combinatorially testing code. [Combinatorial testing](https://youtu.be/SXULADjnO5s?si=k0g6kKlKBKPOgVz3) could not grow at Moore's law's rates.

RAM shortage expected to last until late 2027, reflected in the current silicon stock market trend. Fabs are being built/infrastructure is built from ground-up. Cerebras IPO! Cerebras is [coming](https://luma.com/kahupbqf?tk=mPydtq) to IEEE @ Stanford May 18th.

---

## Hackathon meta

1. Many companies have policies sponsoring only top-tier hackathons with famous people or large prize pools. If you do want to organize a hackathon, start from having interesting people as the base layer. This goes for seeding social networks in general.

2. A Unitree partner was kicked out of the hackathon venue, since they weren't sponsoring any APIs, prize money more than displaying a robotic dog. An employee was treated as a cog. Unitree's robotic dog wasn't technologically groundbreaking, however, the co-organizing company in this hackathon is just remixing the LeRobot arm. **If everyone is repackaging existing open-source systems, the social norm shifts towards gatekeeping rather than creation.** This is like how the DJ culture is a bit cold since people're remixing music that is publically accessible, compared to the ML research scene where there are thinking moats.

3. Technical skills are often the entry ticket, systems-thinking skills are differentiators. In the NeurotechX Hackathon at Frontier Tower, Sharena Rice shared a systems account of failure modes in neurotech. Individuals with deep expertise get stuck in neurotech with no authority or decision-making patterns. My friend and I discussed that after ~Jul 2025, people purely focusing on technical skills are kind of having a challenging time.

4. One of the hackathon participants tracked neurotech funding via IBIS World, cold emailed accordingly and secured an internship.

---

## Also reading

**Permutation City.** First impressions: Its 2050 homogenous-earth timeline seem to closely echo late 2020s San Francisco in a heterogenously developing world. It gets AI, VR systems that we have now, but not yet any mind upload. Also, the characters are major procrastinators and heavily use coercion.

**Cybersentics book club** — Sentics was the proto-cognitive science in the 1950s. There was 7 universal emotions across cultures, measured with pressure of the tip of the finger when a stimuli is shown. It resembled a crude version of EEG waveforms. Composer's typical musical forms correlated to sentics. There are many well-thought out discussion questions by the host, [Anastasia Chernysheva](https://anastasiachernysheva.substack.com/). I would recommend going to these book clubs.
