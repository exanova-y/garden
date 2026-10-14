---
layout: layouts/post.njk
title: "Brain-Computer Interfaces articles, electromyography and electrooculography"
date: 2022-07-10
author: "Yoyo"
category: lab
tags: ["eeg"]
---

Completed during high school while under \$1000 budget. There were rarely any guided tutorials back then. So, I had to dig through documentation, numerous forums, debug software and hardware.

### Article: [How Neuralink Works and Where It's Going](https://adiabatic.garden/favs/neuralink-exposition/)

![](/assets/images/neuralink.jpg)

### Project: [Playing the chrome dino game by blinking](https://youtu.be/v1_EIlfJDdc)

![](/assets/images/dino.png)

**Summary:** I detected my blinking using the OpenBCI biosensing kit and wrote a python program to convert it into pressing the space bar.

**How this works:** Implemented electrooculography (EOG)! So, the eyeball is positively charged near the front (cornea) and negatively charged near the back. Blinks are vertical movements that cause significant spikes and valleys in the amplitudes of recorded brainwaves. A threshold is set in python script. 

### Project: [Use fEMG to detect valence while viewing ads!](https://yoyoyuan.medium.com/how-facial-electromyography-femg-can-lead-to-game-changer-ads-ca32cbcfa244)

![](/assets/images/femg.png)

[Video demo](https://www.youtube.com/watch?v=-6DrgKgwDxE&feature=youtu.be&ab_channel=YoyoYuan)

**Summary**:
How do your users feel about the ad? Getting non-sugarcoated feedback seems impossible--but wait: Smiling and frowning each correspond to activating of a muscle group. We can detect changes in voltage of these groups and connect the results to lighting up LEDs.

Unless the user is under muscle relaxants, this method always picks up the accurate responses, one-up surveys and computer vision analyses. This method can be combined to also output gaze direction and emotional response intensity, which has strong applications in marketing.

### Project: [Composing music with EEG data and MuseNet](https://yoyoyuan.medium.com/on-the-origin-of-musical-bacteria-eb0f5257f062)

![Untitled](/assets/images/musenet.webp)

**Summary:**

First, a 20 sec musical sample is generated. The amplitudes of brainwaves are mapped into a good-sounding musical scale (C Locrian). 

Then we iterate: The sample is repeatedly passed into MuseNet for 7+ times, which is an AI model for extending music. 

### Bonus Article: [The application of BCIs in ADHD](https://yoyoyuan.medium.com/how-brain-computer-interfaces-can-help-children-with-adhd-e758b03952f4)

![](/assets/images/adhder.webp)

**Summary:**

The current diagnosis for ADHD is subjective and slow. Some BCIs are approved to improve the accuracy of a specific subtype of ADHD. 

The current medical treatment involves guess and checking the right drug, while CBT is an indirect solution and depend on willpower. 

Some BCIs can directly alter biology by stimulating the brain. Some can provide fast feedback on focus while offering engaging games