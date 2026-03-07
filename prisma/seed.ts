import { PrismaClient, StepType, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── CREATE DEV USER ───
  const devUser = await prisma.user.upsert({
    where: { email: "dev@example.com" },
    update: {},
    create: {
      email: "dev@example.com",
      name: "Dev User",
      passwordHash: await hash("devpassword123", 12),
      role: UserRole.ADMIN,
    },
  });
  console.log(`Created dev user: ${devUser.email} (${devUser.role})`);

  // ─── COURSE 1: DON'T GET TRICKED ───
  const course1 = await prisma.course.upsert({
    where: { slug: "dont-get-tricked" },
    update: {},
    create: {
      title: "Don't Get Tricked — Spotting Bad Arguments",
      slug: "dont-get-tricked",
      description:
        "The entry point. Learn to recognize the most common reasoning tricks used by salespeople, politicians, friends, and your own brain. Each sequence teaches you to spot a specific pattern of manipulation.",
      published: true,
      sortOrder: 1,
    },
  });

  // Sequence 1: The Pressure Play
  const seq1 = await prisma.sequence.upsert({
    where: { courseId_slug: { courseId: course1.id, slug: "the-pressure-play" } },
    update: {},
    create: {
      courseId: course1.id,
      title: "The Pressure Play",
      slug: "the-pressure-play",
      description:
        "How urgency is manufactured to shut down your thinking.",
      published: true,
      sortOrder: 1,
    },
  });

  const pressurePlaySteps = [
    {
      type: StepType.INSTRUCTION,
      sortOrder: 1,
      content: {
        body: `You're about to learn the most common trick in the book.\n\nIt's used by salespeople, by politicians, by your own friends, and — if you're honest — by you. It works almost every time, and it works *because* it bypasses the part of your brain that thinks carefully.\n\nThe trick is **manufactured urgency**.\n\n"Act now." "Limited time." "If you don't decide today, the offer disappears." "We need an answer by end of day."\n\nThe pressure play works by making you feel like **thinking is the enemy** — that any delay is a loss. Once you feel that, you stop reasoning and start reacting.\n\nLet's see if you can spot it when it's aimed at you.`,
      },
    },
    {
      type: StepType.INSTRUCTION,
      sortOrder: 2,
      content: {
        body: `## The Setup\n\nYou're looking at an apartment. It's nice — good location, reasonable price. The landlord says:\n\n> *"I've got three other people coming to see it this afternoon. If you want it, I'll need a deposit before you leave."*\n\nFeel that? That little spike of anxiety? The tightening in your chest that says *I might lose this*?\n\nThat's the pressure play at work. The landlord may be telling the truth. There may be three other people. But notice what the statement *does* regardless of whether it's true: it makes you feel like **thinking carefully is a luxury you can't afford.**\n\nThe question isn't whether the landlord is lying. The question is: **why does someone else's timeline get to override your decision-making process?**`,
      },
    },
    {
      type: StepType.MULTIPLE_CHOICE,
      sortOrder: 3,
      content: {
        prompt: `You're shopping for a laptop online. A banner at the top says:\n\n> *"Only 2 left in stock — order soon!"*\n\nWhat's the most accurate way to describe what this message is doing?`,
        options: [
          {
            id: "a",
            text: "It's lying — they probably have plenty in stock.",
            isCorrect: false,
            explanation:
              "Maybe, but that's not the key insight. Even if it's true that only 2 are left, the message is still doing something specific to your decision-making. Focusing on whether it's a lie misses the mechanism.",
          },
          {
            id: "b",
            text: "It's giving you useful inventory information so you can plan.",
            isCorrect: false,
            explanation:
              "That's the surface-level reading, and it's technically true. But ask yourself: why is this information displayed as a bright banner instead of small text in the product details? The *presentation* tells you the purpose isn't informational — it's motivational.",
          },
          {
            id: "c",
            text: "It's converting a purchase decision into a speed decision — making you feel like the cost of thinking is losing the item.",
            isCorrect: true,
            explanation:
              "That's it. The message reframes the situation: instead of asking 'do I want this laptop at this price?' you're now asking 'can I afford to wait?' Those are completely different questions, and the second one always favors buying now.",
          },
        ],
        shuffleOptions: false,
      },
    },
    {
      type: StepType.MULTIPLE_CHOICE,
      sortOrder: 4,
      content: {
        prompt: `Here's a subtler one.\n\nYou mention to a friend that you're thinking about going back to school. They say:\n\n> *"You should just do it. You've been talking about this for years. At some point you have to stop thinking and start acting."*\n\nThis feels supportive. Is there a pressure play here?`,
        options: [
          {
            id: "a",
            text: "No — this is just honest encouragement from a friend.",
            isCorrect: false,
            explanation:
              "It might be well-intentioned, but good intentions don't neutralize the mechanism. Reread it: the argument is that *thinking about it further is a sign of weakness or indecision*. That's the pressure play — it frames careful deliberation as a character flaw. Your friend probably doesn't mean it that way, but the structure of the argument still works the same as the car salesman's.",
          },
          {
            id: "b",
            text: "Yes — it frames continued deliberation as a failure, which pressures you to act before you've decided clearly.",
            isCorrect: true,
            explanation:
              "Exactly. 'Stop thinking and start acting' is the pressure play in its purest form — it explicitly says that the problem is your thinking. The fact that it comes from a caring friend makes it more effective, not less, because you're less likely to question the framing.",
          },
          {
            id: "c",
            text: "Yes — your friend is trying to manipulate you into a bad decision.",
            isCorrect: false,
            explanation:
              "This overreads the situation. Your friend almost certainly isn't trying to manipulate you. But recognizing the *structure* of an argument doesn't require assuming bad intent. A pressure play is a pressure play whether the person deploying it knows what they're doing or not. The skill is seeing the pattern, not assigning blame.",
          },
        ],
        shuffleOptions: false,
      },
    },
    {
      type: StepType.INSTRUCTION,
      sortOrder: 5,
      content: {
        body: `## Key Insight\n\nNotice what just happened in that last question. All three answers acknowledged the friend's good intentions — but only one correctly identified the mechanism.\n\nThis is important: **the pressure play is not about bad people.**\n\nMost urgency isn't manufactured by con artists. It's manufactured by ordinary situations, ordinary people, and ordinary emotions. Your boss needs an answer because *their* boss is pressuring *them*. The store really is closing in ten minutes. Your friend really does care about you.\n\nThe trick isn't spotting villains. The trick is noticing when **the timeline someone else is imposing doesn't match the importance of the decision you're making.**\n\nA good rule: the bigger the decision, the more suspicious you should be of any pressure to decide quickly.`,
      },
    },
    {
      type: StepType.MULTIPLE_CHOICE,
      sortOrder: 6,
      content: {
        prompt: `**This one is designed to fool you.**\n\nYou've been offered a new job. The salary is 20% more than you currently make. The hiring manager says:\n\n> *"We'd love to have you, but we're moving fast on this. Can you let us know by Friday?"*\n\nFriday is three days away. What's your best move?`,
        options: [
          {
            id: "a",
            text: "Accept — 20% raise and a clear deadline. No reason to wait.",
            isCorrect: false,
            explanation:
              "The 20% raise is real, but it's doing the pressure play's job for it. You're so focused on the gain that the three-day timeline feels reasonable. Ask yourself: is three days enough to evaluate a major life decision? To negotiate terms? To compare other options? The salary figure is anchoring you to 'yes' while the deadline prevents you from thinking past it.",
          },
          {
            id: "b",
            text: "Decline — any company that pressures you isn't worth working for.",
            isCorrect: false,
            explanation:
              "This overcorrects. A hiring timeline isn't inherently manipulative — companies do have real needs to fill positions. Rejecting every deadline as a pressure tactic is just as unthinking as accepting every one. The goal isn't to become suspicious of everything. It's to buy yourself room to think.",
          },
          {
            id: "c",
            text: "Respond by Friday, but use the time to evaluate the full picture — not just the salary. If you need more time, ask for it and see what happens.",
            isCorrect: true,
            explanation:
              "This is the move. You respect their timeline without letting it override your process. And the ask for more time is diagnostic: a company that won't give you an extra few days for a major decision is telling you something about how they operate. The pressure play loses its power the moment you treat the deadline as negotiable rather than fixed.",
          },
        ],
        shuffleOptions: false,
      },
    },
    {
      type: StepType.FREE_RESPONSE,
      sortOrder: 7,
      content: {
        prompt: `Think of a time in your own life when you made a decision faster than you should have because you felt pressured by urgency — real or manufactured.\n\nDescribe the situation briefly. Then answer: **what would you do differently now?**\n\nThere's no right or wrong answer here. The exercise is noticing the pattern in your own history.`,
        sampleAnswer:
          "The value of this exercise is personal — there's no single correct answer. What matters is whether you can identify: (1) the urgency that was imposed, (2) whether that urgency matched the size of the decision, and (3) what you'd do to buy yourself time if it happened again. If you couldn't think of an example, that's worth noticing too — it might mean the pressure play works on you so smoothly that you don't register it as pressure.",
      },
    },
    {
      type: StepType.INSTRUCTION,
      sortOrder: 8,
      content: {
        body: `## The Antidote\n\nThe counter to the pressure play is almost embarrassingly simple:\n\n**"I need to think about it."**\n\nThat's it. Five words. They work on salespeople, on bosses, on friends, on yourself. The pressure play's power comes entirely from the assumption that delay is dangerous. The moment you assert your right to think, the spell breaks.\n\nIf the opportunity is real, it will survive your thinking about it. If it won't survive you thinking about it — that tells you everything you need to know.\n\n## What You Learned\n\n**Manufactured urgency** converts your decisions into reactions by making you feel like careful thought is a luxury you can't afford. It works whether the person using it means to or not. The defense is simple: insist on time proportional to the size of the decision, and treat any resistance to that as information.`,
      },
    },
  ];

  for (const step of pressurePlaySteps) {
    await prisma.step.create({
      data: {
        sequenceId: seq1.id,
        type: step.type,
        sortOrder: step.sortOrder,
        content: step.content,
      },
    });
  }
  console.log(`Created sequence: ${seq1.title} (${pressurePlaySteps.length} steps)`);

  // ─── COURSE 2: RHETORICAL DEVICES ───
  const course2 = await prisma.course.upsert({
    where: { slug: "rhetorical-devices" },
    update: {},
    create: {
      title: "Rhetorical Devices — How Language Acts on People",
      slug: "rhetorical-devices",
      description:
        "Learn to identify how language persuades, moves, and deceives. Rhetoric is not ornament — it is the study of how language acts on people.",
      published: true,
      sortOrder: 2,
    },
  });

  // Sequence 1: Introduction to Rhetorical Devices
  const seq2 = await prisma.sequence.upsert({
    where: {
      courseId_slug: { courseId: course2.id, slug: "intro-rhetorical-devices" },
    },
    update: {},
    create: {
      courseId: course2.id,
      title: "Introduction to Rhetorical Devices",
      slug: "intro-rhetorical-devices",
      description:
        "Learn to identify how language persuades, moves, and deceives. Covers anaphora, chiasmus, and enthymeme.",
      published: true,
      sortOrder: 1,
    },
  });

  const rhetoricalSteps = [
    {
      type: StepType.INSTRUCTION,
      sortOrder: 1,
      content: {
        body: `**Rhetoric** is not ornament. It is the study of how language acts on people — how it persuades, clarifies, obscures, and moves.\n\nYou already use rhetorical devices constantly. When you repeat a word for emphasis, when you ask a question you already know the answer to, when you arrange ideas from weakest to strongest — these are rhetorical moves.\n\nThis sequence will teach you to **see** them, **name** them, and eventually **deploy** them deliberately.\n\nWe'll start with three foundational devices: **anaphora**, **chiasmus**, and **enthymeme**.`,
      },
    },
    {
      type: StepType.INSTRUCTION,
      sortOrder: 2,
      content: {
        body: `## Anaphora\n\nAnaphora is the repetition of a word or phrase at the **beginning** of successive clauses.\n\n> *"We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets."*\n> — Winston Churchill\n\nThe repetition of *"we shall fight"* does two things: it creates **rhythm**, and it creates **inevitability**. By the third repetition, the listener feels the resolve as physical momentum.\n\nAnaphora works because the human ear expects patterns. Once a pattern is established, each repetition lands harder.`,
      },
    },
    {
      type: StepType.MULTIPLE_CHOICE,
      sortOrder: 3,
      content: {
        prompt:
          'Which of the following is an example of anaphora?\n\nRead each option carefully. Remember: anaphora is repetition at the **beginning** of successive clauses.',
        options: [
          {
            id: "a",
            text: '"The city was silent, the streets were silent, the houses were silent."',
            isCorrect: false,
            explanation:
              'Close — there is repetition of "silent," but it appears at the END of each clause. Repetition at the end is called **epistrophe**, not anaphora.',
          },
          {
            id: "b",
            text: '"Every day I wake, every day I work, every day I wonder if this is enough."',
            isCorrect: true,
            explanation:
              'Correct. "Every day I" repeats at the beginning of each clause. Notice how the third clause breaks the expected verb pattern (wake, work, wonder) — that surprise is what carries the emotional weight.',
          },
          {
            id: "c",
            text: '"She looked at the river, the long and winding river, the river that had taken everything."',
            isCorrect: false,
            explanation:
              'This repeats "river" but not at the beginning of clauses — it\'s woven throughout. This is closer to **conduplicatio** (repetition of a key word in various positions).',
          },
        ],
        shuffleOptions: false,
      },
    },
    {
      type: StepType.INSTRUCTION,
      sortOrder: 4,
      content: {
        body: `## Chiasmus\n\nChiasmus reverses the structure of two parallel clauses. The pattern is **A B → B A**.\n\n> *"Ask not what your country can do for you — ask what you can do for your country."*\n> — John F. Kennedy\n\nThe structure: **country → you** flips to **you → country**.\n\nChiasmus works because the reversal forces the listener to reconsider the first half in light of the second. It creates a sense of **balance** and **completeness** — as though the idea has been examined from both sides and resolved.\n\nIt also makes ideas enormously quotable. The symmetry lodges in memory.`,
      },
    },
    {
      type: StepType.MULTIPLE_CHOICE,
      sortOrder: 5,
      content: {
        prompt: "Which of the following demonstrates chiasmus?",
        options: [
          {
            id: "a",
            text: '"When the going gets tough, the tough get going."',
            isCorrect: true,
            explanation:
              '"Going/tough" reverses to "tough/going." The A-B / B-A structure is the hallmark of chiasmus. Notice it also functions as a kind of argument — the reversal implies that toughness and persistence are the same thing.',
          },
          {
            id: "b",
            text: '"I came, I saw, I conquered."',
            isCorrect: false,
            explanation:
              "This is **tricolon** — three parallel clauses of similar length. There's no reversal. Each clause escalates but maintains the same structure (subject → verb).",
          },
          {
            id: "c",
            text: '"To err is human, to forgive is divine."',
            isCorrect: false,
            explanation:
              "This is **antithesis** — two contrasting ideas in parallel structure. The structure is A-B / A-B (infinitive → adjective), not A-B / B-A. Close in feel, but structurally distinct from chiasmus.",
          },
        ],
        shuffleOptions: false,
      },
    },
    {
      type: StepType.INSTRUCTION,
      sortOrder: 6,
      content: {
        body: `## Enthymeme\n\nAn enthymeme is a syllogism with a **missing premise** — an argument that leaves one step unstated because the audience is expected to fill it in.\n\nFormal syllogism:\n> All men are mortal. Socrates is a man. Therefore, Socrates is mortal.\n\nEnthymeme:\n> *"Socrates is a man, so of course he's mortal."*\n\nThe missing premise ("all men are mortal") is so widely accepted that stating it would feel pedantic.\n\nEnthymemes are the most common form of everyday argument — and the most dangerous. **The unstated premise is the one that goes unexamined.** When a politician says "we need a leader with military experience," the enthymeme assumes: *military experience makes someone a good leader.* That premise may or may not be true, but because it's never stated, it's never challenged.`,
      },
    },
    {
      type: StepType.FREE_RESPONSE,
      sortOrder: 7,
      content: {
        prompt:
          'Read the following statement and identify the **unstated premise** (the enthymeme):\n\n> *"You went to Harvard — you\'ll figure it out."*\n\nWhat assumption is the speaker relying on without stating it? Why might that assumption be worth questioning?',
        sampleAnswer:
          "The unstated premise is that attending Harvard guarantees competence or intelligence sufficient to solve any problem. This is worth questioning because institutional affiliation doesn't reliably predict problem-solving ability in all contexts — it conflates credential with capability.",
      },
    },
    {
      type: StepType.INSTRUCTION,
      sortOrder: 8,
      content: {
        body: `## Sequence Complete\n\nYou've now encountered three foundational devices:\n\n**Anaphora** — repetition at the start of clauses. Creates rhythm and momentum.\n\n**Chiasmus** — reversed parallel structure. Creates balance and memorability.\n\n**Enthymeme** — argument with a hidden premise. Creates persuasion by embedding assumptions.\n\nThe next sequence would cover **antithesis**, **litotes**, and **kairos** — but for now, notice these three in the language around you. News headlines, speeches, advertisements, everyday conversation. Once you can see the scaffolding, you can't unsee it.`,
      },
    },
  ];

  for (const step of rhetoricalSteps) {
    await prisma.step.create({
      data: {
        sequenceId: seq2.id,
        type: step.type,
        sortOrder: step.sortOrder,
        content: step.content,
      },
    });
  }
  console.log(`Created sequence: ${seq2.title} (${rhetoricalSteps.length} steps)`);

  // Enroll dev user in both courses
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: devUser.id, courseId: course1.id } },
    update: {},
    create: { userId: devUser.id, courseId: course1.id },
  });
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: devUser.id, courseId: course2.id } },
    update: {},
    create: { userId: devUser.id, courseId: course2.id },
  });
  console.log("Enrolled dev user in both courses");

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
