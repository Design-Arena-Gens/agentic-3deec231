"use client";

import { useMemo, useState } from "react";
import styles from "./InstructionAgent.module.css";

type Step = {
  title: string;
  bullets: string[];
};

type Plan = {
  summary: string;
  steps: Step[];
  resources: string[];
};

const presets: Record<string, Step> = {
  hero: {
    title: "Craft the Hero Section",
    bullets: [
      "Define a concise headline communicating the primary value proposition.",
      "Add a supportive subheading that clarifies the problem you solve.",
      "Use a strong call-to-action button and consider a secondary link for hesitant visitors.",
      "Provide a visual anchor (mockup, illustration, or product screenshot) aligned with the headline.",
    ],
  },
  features: {
    title: "Explain Core Features",
    bullets: [
      "Group related capabilities into 3-4 concise cards.",
      "Pair short headings with one-sentence descriptions focused on customer outcomes.",
      "Use simple iconography to make scanning effortless.",
      "Add microcopy to highlight proof points (metrics, testimonials, partners).",
    ],
  },
  pricing: {
    title: "Design the Pricing Grid",
    bullets: [
      "Offer 2-3 plan tiers with a highlighted recommended option.",
      "Ensure each plan has a quick summary, price, and differentiating features.",
      "Include a primary CTA for the recommended tier and a secondary compare option.",
      "Address common purchase anxieties with guarantees or FAQ items nearby.",
    ],
  },
  contact: {
    title: "Build Trust & Contact Paths",
    bullets: [
      "Add a short about blurb and team or brand logos for credibility.",
      "Provide at least two contact methods (form, email, chat).",
      "Surface social proof such as testimonials or review snippets.",
      "Close with a reiteration of the main call-to-action.",
    ],
  },
  blog: {
    title: "Highlight Content Resources",
    bullets: [
      "Showcase featured articles or tutorials with clear categories.",
      "Include search and filtering for content-heavy sections.",
      "Surface author info to reinforce expertise.",
      "Add newsletter or subscription hooks for retention.",
    ],
  },
};

const defaultSteps: Step[] = [
  {
    title: "Clarify the Page Goal",
    bullets: [
      "Write one sentence describing what success looks like for the visitor.",
      "List the primary and secondary actions the page should drive.",
      "Identify the target audience segment and their pain points.",
    ],
  },
  {
    title: "Map the Narrative Flow",
    bullets: [
      "Plan the order of sections to move visitors from awareness to action.",
      "Decide how to handle navigation, footer, and trust elements.",
      "Draft a content outline with key talking points and proof.",
    ],
  },
  {
    title: "Design & Implementation Checklist",
    bullets: [
      "Sketch wireframes for each section before high-fidelity design.",
      "Define the visual system (color palette, typography, spacing).",
      "Break the build into components and map to routes or anchors.",
      "Test across devices and gather feedback before launch.",
    ],
  },
];

function inferSections(prompt: string): Step[] {
  const normalized = prompt.toLowerCase();
  const stack: Step[] = [];

  if (/(landing|saas|startup|product|app)/.test(normalized)) {
    stack.push(presets.hero, presets.features);
  }

  if (/(pricing|subscriptions|plans|tiers)/.test(normalized)) {
    stack.push(presets.pricing);
  }

  if (/(contact|support|team|about)/.test(normalized)) {
    stack.push(presets.contact);
  }

  if (/(blog|resources|articles|docs|knowledge)/.test(normalized)) {
    stack.push(presets.blog);
  }

  if (/(portfolio|case study|work)/.test(normalized)) {
    stack.push({
      title: "Showcase Work & Results",
      bullets: [
        "Curate 3-6 flagship projects with visuals and measurable outcomes.",
        "Explain the challenge, your solution, and the impact for each project.",
        "Add client testimonials or quotes adjacent to the related project.",
        "Provide an easy way to request a quote or start a project.",
      ],
    });
  }

  if (/(e-?commerce|shop|store)/.test(normalized)) {
    stack.push({
      title: "Structure the Shopping Experience",
      bullets: [
        "Create promotional space for featured collections or seasonal offers.",
        "Design product cards with imagery, key attributes, price, and CTA.",
        "Enable filtering, sorting, and search for larger catalogs.",
        "Plan the checkout visibility: cart drawer, sticky CTAs, trust badges.",
      ],
    });
  }

  if (/(event|conference|webinar)/.test(normalized)) {
    stack.push({
      title: "Promote the Event",
      bullets: [
        "Lead with event hook (theme, speakers, location, date).",
        "Add agenda highlights and session tracks for context.",
        "Expose registration options with pricing or RSVP links.",
        "Answer logistics: venue, travel, FAQs, and sponsorship opportunities.",
      ],
    });
  }

  return stack;
}

function buildPlan(prompt: string): Plan {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      summary: "Describe the web page you want to create to generate a tailored plan.",
      steps: defaultSteps,
      resources: [
        "Use actionable verbs when describing sections.",
        "Mention key content types (pricing, testimonials, features).",
        "Call out your target audience or product niche.",
      ],
    };
  }

  const inferredSteps = inferSections(trimmed);
  const mergedSteps =
    inferredSteps.length > 0 ? [...defaultSteps, ...inferredSteps] : defaultSteps;

  const summary = [
    `Build a page for "${trimmed}".`,
    inferredSteps.length === 0
      ? "Focus on clarifying goals, mapping the narrative, and iterating on design."
      : "Use the tailored section breakdown below to guide content and layout decisions.",
  ].join(" ");

  const resources: string[] = [];
  if (/seo|search/.test(trimmed.toLowerCase())) {
    resources.push("Plan structured headings (H1-H3) and metadata for SEO.");
  }
  if (/launch|deadline|timeline/.test(trimmed.toLowerCase())) {
    resources.push("Establish a delivery timeline with checkpoints for review.");
  }
  if (/brand|visual/.test(trimmed.toLowerCase())) {
    resources.push("Document the brand system: colors, typography, imagery styles.");
  }
  if (resources.length === 0) {
    resources.push(
      "Validate with at least three user feedback sessions before shipping."
    );
  }

  return {
    summary,
    steps: mergedSteps,
    resources,
  };
}

export function InstructionAgent() {
  const [prompt, setPrompt] = useState("");
  const plan = useMemo(() => buildPlan(prompt), [prompt]);

  return (
    <section className={styles.agent}>
      <header>
        <h1>Web Page Instruction Agent</h1>
        <p>
          Describe the web experience you want to build, and the agent generates
          structured steps that move you from idea to launch.
        </p>
      </header>

      <label className={styles.inputLabel} htmlFor="prompt">
        Enter your vision
      </label>
      <textarea
        id="prompt"
        placeholder="Example: Landing page for a SaaS analytics platform targeting marketing teams..."
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />

      <article className={styles.plan}>
        <h2>Strategy Summary</h2>
        <p>{plan.summary}</p>

        <h2>Execution Steps</h2>
        <ol>
          {plan.steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <ul>
                {step.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h2>Extra Considerations</h2>
        <ul className={styles.resources}>
          {plan.resources.map((resource) => (
            <li key={resource}>{resource}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
