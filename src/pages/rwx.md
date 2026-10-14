---
layout: layouts/post.njk
title: "The rwx cycle"
date: 2026-07-05
author: "Yoyo"
category: lab
tags: ["feral-scholars"]
---
Autoresearch weaponization to ingest hundreds of papers in hours, run in-silico experiments, and write up 5000 words in an afternoon when you're too broke to afford journal subscriptions. Tested and true.

## R: Literature review
[Jiabin Huang research advice](https://github.com/jbhuang0604/awesome-tips) offers a variety of tips for researchers.

First, perform a literature review. 

*Boiling the Ocean method:* There are various "awesome-xyz" premade lists on GitHub that you can use to find papers. Consult past conferences to see where the field is heading. Cluster these papers into categories to understand "why x hasn't been solved yet".

*Availability heuristic:* Since many papers exist on X, you can just ask Grok to search for threads. Alternatively, look online at your favourite theorists' websites, as well as non-traditional researcher websites, and see if there are any recent writings that haven't been implemented yet. For example, I have implemented [undisclosed] suggestions from gwern.net for a research project, which isn't widely seen in academic literature.

Then, feed the context into your favourite research agent, in this case, I use Feynman developed by my mutual Advait and have suggested the following prompt contributions.

*Feynman prompts sorted into different levels of granularity:*

1. [insert link] look around! As a leading expert in neuroscience, explain this lab's research canon and how it situates in the contemporary work ranked by originality, then point to individual significant papers of interest.

2. You are a research methodology expert. For each paper, identify the major vs minor contributions buried in this data, rank them by originality, and show with precision and accuracy where each one challenges or extends existing literature. Use bold text very sparingly for notetaking in Logseq. Provide a glossary for a technical 20 year old. For each formula, provide intuition for reconstructing it step by step, with patterns understandable to a technical 20 year old. Do not use bold text.

3. Still acting as the research methodology expert, explain from the primitives level how they designed the pipeline, the quality and type of evidence and reasoning used, and consistency.

4. Michelin-tabling question (if you're meeting with the authors)
As a leading neuroscientist, you find yourself at a fancy lunch with the authors. Read the discussion or looking forward section while thinking granularly. What are the 3 quirky follow-up questions that you would discuss with the team? What are the 3 key implications of this argument that you would encourage the authors to think about?

### Researcher archetypes
Identify your default [research style](https://x.com/RaziaAliani/status/1980621481949225406?s=20) and use it to your advantage!
- The deep-dive specialist (months/years on one breakthrough) 
- The strategic collaborator (connecting dots across projects) 
- The methodology expert (enabling others' discoveries) 
- The translator (making research accessible and actionable)


## X: Scorched earth hypothesis testing
- If you have around a week for a project, you should start running experiments ideally on day 1 or 2 to leave time for adjustments. Notice and resist the urge to execute all experiments on day 4.
- 50% of the time should be spent on running experiments, logistics, or building.
- Code should be constantly running.

[Representations of the World in the Human Brain](https://www.youtube.com/watch?v=cFwHAMf0kEc) by Jack Gallant, an experimentalist.

According to your "why x hasn't been solved yet" buckets, continue narrowing each bucket down to testable and plausible hypothesis lineages. Come up with a list of hypotheses (anywhere from 1 to even 40) ranked by upside risk and time taken to test. 

As soon as we have the hypothesis, we can scope the experiment. [Tetraslam's playground](https://github.com/Tetraslam/playground) has a great style guide for agents. You should also write a markdown style guide.

Sketch a diagram of how information flows through the key components, starting out simple. Pick your tools accordingly for each stage. Ask agents to contrast tools by community size, features, cognitive complexity, and pick the most relevant one for your use case.

It is a delicate balance to understand the experiment you are running vs optimizing for speed. You will feel cognitive strain. Adjust mental impedance accordingly. Remember: Too much speed can lead to accumulated technical debt exponentially further down the line. (See *A Philosophy of Software Design* by John Ousterhout.)

Put all the observations and graphs into a page and share it with your collaborators. If an experiment didn't work, why? Brainstorm the most probable explanations. Review related literature again, adjust the direction, and proceed to test.

Models need to be evaluated. Consult [vals.ai](https://vals.ai/home)

### Collaborators
Take advantage of mornings, lunch, evenings, walks to update results and brainstorm. Do not block others from doing their own work!

Meetings should not be the first time results are presented, since almost no one will digest them live and provide insightful suggestions.

## W: drafting papers
- Throughout this entire time, you should be accumulating data points in all sections of the paper in parallel, rather than starting from scratch.
- Figures drive the narrative. See: [https://x.com/jbhuang0604/status/1437443017510621185](https://x.com/jbhuang0604/status/1437443017510621185), [https://x.com/jbhuang0604/status/1665738070002483201](https://x.com/jbhuang0604/status/1665738070002483201), and [https://github.com/jbhuang0604/awesome-tips/blob/main/paper-writing.md](https://github.com/jbhuang0604/awesome-tips/blob/main/paper-writing.md)
- Write these first: Introduction, Related Work, Methods
  - Discussion: Feel free to word vomit, and ask Feynman, or equivalent, to clean it up later.
- Write these while you are running experiments: 
  - Discussion, Appendix
- Write these last:
  - Key contributions (Abstract), Results
- Ask Feynman, or equivalent, to compile the paper from any medium, such as markdown, into TeX
- Preferably, import the paper into Overleaf so your collaborators can edit it too, as opposed to just having a PDF.

### Monofocus
If you are researching at a small startup, it is extremely difficult to simultaneously run side projects and not recommended. The founding team has extremely high stakes over a period of years and sometimes devotes 120 hours per week to ensure success. Founders may have given up $250k/yr jobs at companies to build their own startup, or even social time. You will notice that the singular research project undergoes mitosis and contain a multitude of sub-projects itself as time stretches.

## Links
### Where to find free PDFs
![let me in](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExajVlNzJibWI5azBiejZqdWxrMG9lamg0Ymh6MWp4YnZyenIybDdsNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yx400dIdkwWdsCgWYp/giphy.gif)
- SciHub
- Anna's Archive
- Many PDFs exist informally within the network on are.na, curius.app, or Grok.
- Gwern.net houses numerous PDFs.
- Go to various campuses (e.g. UC Berkeley, Stanford) and connect to wifi for free access.
- You can also buy access to e.g. Stanford libraries by the week.

### Paper tools
- Scholarinbox/X lists for trending materials. You can scrape Scholarinbox by conference to create maps.
- Customized Feynman for field investigations and lab canons.
- Curius for clipping links. People traditionally use Zotero, but I find it a bit slow.
- Logseq for notetaking. Upsides: symlinking, block-level searching and quoting compared to Obsidian. Equivalent in journal pages, graphs. Downside: no phone syncing, which can lead to chore backlogs when on the go.
- [alphAxiv autoscience](https://x.com/askalphaxiv/status/2069799709045354710) (haven't tested)
- Claude Science (haven't tested)
- Open Science
- [Plurigrid skills](https://github.com/plurigrid/asi). Consists of a series of systems/cybernetics adjacent skills to be used by agents. Just `npx skills add` it. Note that there are several hundred skills and may crowd out existing skills that you have downloaded!

### Mental models
#scienceoflearning, #networks, #complexcausality, #interpretivelens
