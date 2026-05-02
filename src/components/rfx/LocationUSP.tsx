import { Feather, Sparkles, UserCircle2, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type USP = { icon: LucideIcon; title: string; body: string };

const USPS: USP[] = [
  {
    icon: Feather,
    title: "No packages, only proposals",
    body: "Every event designed from scratch around your vision — no recycled menus.",
  },
  {
    icon: UserCircle2,
    title: "Personally led by Laura",
    body: "One stylist, one client, no handovers. The person you brief is the person who installs.",
  },
  {
    icon: Workflow,
    title: "End-to-end, fully handled",
    body: "Design, sourcing, build, install, breakdown. Nothing left for you on the day.",
  },
  {
    icon: Sparkles,
    title: "Editorial standard",
    body: "Considered detail throughout. Never overdone, never off-the-shelf.",
  },
];

const LocationUSP = () => {
  return (
    <section
      id="usps"
      className="rfx-section dark"
      aria-label="What makes River Fox Events different"
    >
      <div className="container-rfx">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-10">
          {USPS.map((u, i) => {
            const Icon = u.icon;
            return (
              <div key={u.title} className="fade-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <Icon
                  size={28}
                  strokeWidth={1.25}
                  aria-hidden="true"
                  className="mb-5"
                  style={{ color: "hsl(var(--accent-warm))" }}
                />
                <h3
                  className="font-serif-rf"
                  style={{
                    fontSize: "clamp(20px, 1.6vw, 24px)",
                    lineHeight: 1.18,
                    fontWeight: 400,
                    letterSpacing: "-0.012em",
                    color: "hsl(var(--on-deep))",
                  }}
                >
                  {u.title}
                </h3>
                <p
                  className="mt-4 text-[14.5px] leading-[1.65]"
                  style={{ color: "hsl(var(--on-deep-soft))", textWrap: "pretty" }}
                >
                  {u.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LocationUSP;
