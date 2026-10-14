---
layout: layouts/post.njk
title: "Roman streets for more tasteful autoresearch"
date: 2026-08-10
author: Yoyo 
category: lab
---

Feynman autoresearch has 8k stars on GitHub and already 1k forks from various dissatisfied users, showing a strong need for improvement; In an average session of using Feynman, 4 agents including the reviewer, verifier and writer agents coordinate sequentially, progressing from skill -> prompts -> generating new code -> plans -> notes -> drafts -> final outputs, spending around 30k tokens per topic and still not reach Meaningful Progress while being slow and verbose.

One can use a parallel from Roman street networks since they are engineering spectacles. If some agent has already explored this topic space, streets with wider paths and directions should be constructed to avoid independent and identical exploration by a future agent. When a connection is bad, roads can be demoted from viae publicae to viae vicinales, marked as dead-ends or topics could be tossed into the sewers. When needed, shortcuts between roads could be created.

First a primary SQL database can store certain edges and vertices of the research space. Then, new roads can be built using PyTorch geometric and Mikhail Galkin's work. 

Suppose Feynman agent is set off to research "Scaling laws for Neural Language Models" and it thinks "neuro" and "what becomes bottleneck in BCIs as number of electrodes grows" and then "Physical Principles for Scalable Neural Recordings". After Feynman has thought about this, future agents don't need to walk every cobblestone. They can just jump directly from "scaling laws" to "physical principles ..." through a weird structural/analogical street compared to a citation graph or semantic embeddings. This would be faster and more memory efficient. A weaker street between the two topics is "Dario Amodei". Although he is an author on both papers, this "common author" street does not inform why the previous road is intellectually interesting. This is one path that present autoresearch often takes. Graphs contents are differentiable and trainable. If taking certain routes repeatedly leads to good research, gradient descent can teach the model to prefer these roads.