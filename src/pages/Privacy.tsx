import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import ArticleProse from "@/components/article/ArticleProse";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import { applyMeta } from "@/seo/headTags";

const LAST_UPDATED = "5 May 2026";

const Privacy = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/privacy");
    if (route) applyMeta(route);
  }, []);

  return (
    <div className="min-h-screen article-bg text-foreground nav-solid">
      <Nav />
      <main>
        <section className="container-rfx pt-[106px] md:pt-[122px] pb-10 md:pb-14 text-center">
          <h1
            className="font-serif-rf max-w-[18ch] mx-auto"
            style={{
              fontSize: "clamp(44px, 5vw, 72px)",
              lineHeight: 1.04,
              fontWeight: 400,
              letterSpacing: "-0.028em",
            }}
          >
            Privacy &amp; cookies
          </h1>
          <p className="text-[13.5px] text-ink-soft mt-5">
            Last updated {LAST_UPDATED}
          </p>
        </section>

        <ArticleProse>
          <p>
            River Fox Events ("we", "us") is a luxury event-styling studio
            based in Surrey. This page explains what personal information we
            collect when you use this website, how we use it and the cookies
            we set. It is written in plain English. If anything is unclear,
            email{" "}
            <a href="mailto:riverfoxevents@gmail.com">
              riverfoxevents@gmail.com
            </a>{" "}
            and we will explain.
          </p>

          <h2>Who we are</h2>
          <p>
            River Fox Events, 15 Apsley Road, Horley, Surrey, RH6 9RX. We are
            the data controller for any personal information you share with
            us through this site.
          </p>

          <h2>What we collect</h2>
          <p>
            When you submit the enquiry or contact form we collect the name,
            email address, event date, event type, venue, budget and any
            details you choose to include in the message field. We use this
            only to reply to your enquiry and discuss your event. We never
            sell or share it.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiry messages are kept for as long as is reasonable to manage
            the project and any follow-up work, and then deleted. You can ask
            us to delete your data at any time by emailing the address above.
          </p>

          <h2>Cookies</h2>
          <p>
            This site uses one analytics cookie set by Google Analytics 4
            (measurement ID <code>G-L2YVNSW0ZQ</code>). It tells us how many
            people visit, which pages they read and roughly where in the UK
            they are — nothing that identifies an individual. It does not
            follow you to other sites and we do not use it for advertising.
          </p>
          <p>
            The cookie only loads if you click <em>Accept</em> on the cookie
            banner. If you click <em>Decline</em>, or ignore the banner, no
            analytics cookie is set. You can change your mind at any time by
            clearing this site's cookies in your browser — the banner will
            reappear on your next visit.
          </p>

          <h2>Form submissions</h2>
          <p>
            Enquiry and contact forms are processed by Netlify Forms (our
            hosting provider). Submissions are emailed to us and stored in
            Netlify's dashboard. Netlify acts as a data processor on our
            behalf.
          </p>

          <h2>Your rights</h2>
          <p>
            Under UK GDPR you have the right to ask what we hold about you,
            to ask us to correct it, and to ask us to delete it. Email{" "}
            <a href="mailto:riverfoxevents@gmail.com">
              riverfoxevents@gmail.com
            </a>{" "}
            and we will respond within one month. If you are not happy with
            how we have handled your data, you can complain to the
            Information Commissioner's Office at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noopener">
              ico.org.uk
            </a>
            .
          </p>

          <h2>Changes to this page</h2>
          <p>
            If we change how we use your information we will update this
            page. The date at the top shows when it was last revised.
          </p>
        </ArticleProse>

        <div className="pb-24 md:pb-32" />
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
