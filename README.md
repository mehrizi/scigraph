# Weighting
Every Node/Edge has a size attribute that is calculated as a sum of the following attributes:
- Parent Relationship size
- Sum size of books

## Book Weight
Each book has the following attributes, and the size of a book is determined by the multiplication of these attributes:

- Copy count
- Book Grade (Written for public: 1, Specialized: 2)
- Writer Grade (Nobel Winner: 2, Other writers: 1)

Books on the edge of two nodes are listed for both nodes but will contribute a 50% increase in size for each node.

# Positioning
The goal is to minimize the total length of all edges in the graph while ensuring nodes do not overlap. Mathematically, this can be approached as an optimization problem, where we seek to minimize the sum of Euclidean distances between connected nodes. Formally, given a set of nodes (V) and edges (E), we define the total edge length as:

L = Σ d(i,j) for all (i,j) ∈ E

where d(i,j) represents the Euclidean distance between nodes i and j. To prevent overlap, constraints can be introduced such that the minimum distance between any two nodes i, j is greater than a threshold δ. This can be solved using force-directed graph layout algorithms or constraint-based optimization techniques like simulated annealing or genetic algorithms.

# Philosophy
I observe that people specialize in different fields, but they often lack a broader perspective or an understanding of where their expertise fits within the larger body of knowledge.

Some examples:

1. **Freudian Psychoanalysts**: They have a strong grasp of their method but lack awareness of other therapeutic approaches and how psychoanalysis compares.
2. **Focused Programmers**: A developer proficient in ES6, React, and Tailwind might be an expert in implementation but have little knowledge of algorithms or object-oriented programming.
3. **Religious Followers**: A devoted Christian who follows church teachings might never have studied other religions, yet they are at peace with their beliefs.

These examples illustrate individuals deeply knowledgeable in their niche yet unaware of the broader context of their field. This can be risky or, at the very least, costly.

## Why Does It Matter?
While my argument is largely subjective, it is rooted in repeated experience, cognitive reasoning, and study. I believe an objective study of this phenomenon would support my findings, as **patterns of repetition matter**.

My assertion is:

> Every human (as a neural-network-based entity) practicing a subject should acquire knowledge about the subject’s placement within the broader system; otherwise, at some point, it will incur a cost.

### How Can This Be Dangerous?
Consider the following scenarios:

1. A grieving mother, who recently lost her 15-year-old son, seeks help from a psychoanalyst. The analyst follows a traditional method—listening, nodding, and offering containment—but lacks knowledge of alternative treatments like cognitive-behavioral therapy or medication. The next day, she commits suicide.

2. Such a developer usually find his way around googling which a backboned software engineer also does but, when he googles he naively copy past but the engineer understands the backbone. Now this talented programmer is offered a wast project and he accepts it with a low price but the outcome is a messy and low performant app.

3. A devoted Christian follows the teachings of their church, practicing faith without exploring other religions or philosophical perspectives. This unwavering belief provides personal peace, but it can lead to challenges in intercultural interactions. For instance, when faced with a moral dilemma requiring engagement with other belief systems, they may struggle to reconcile differences, potentially leading to misunderstandings or conflicts. In a rapidly globalizing world, an unexamined faith might hinder personal growth and limit meaningful dialogue with others of different backgrounds.

As illustrated in **Why Nations Fail** by Nobel laureates Daron Acemoglu and James A. Robinson, nations collapse when their systems fail. However, systems do not improve unless the majority of people change, and the majority does not change unless they **study**.

Let me emphasize "study". Vandal reading does not guarantee transformation, and if it does, the change is not necessarily positive.

(A discussion on "positive" change might be reserved for another project. 😃)

## Etymological Why
I would like to begin by exploring how knowledge is formed and perceived by our nervous system and brain.

