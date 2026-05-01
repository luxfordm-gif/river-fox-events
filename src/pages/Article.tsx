import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import ReadingProgress from "@/components/article/ReadingProgress";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleCta from "@/components/article/ArticleCta";
import RelatedArticles from "@/components/article/RelatedArticles";
import NotFound from "./NotFound";
import { findArticle, findRelated } from "@/data/articles";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { SITE } from "@/seo/routes";
import { applyMeta, removeJsonLd, upsertJsonLd } from "@/seo/headTags";

const Article = () => {
  useFadeUp();
  useNavScroll();
  const { pathname } = useLocation();
  // /journal/:slug or /journal/:slug/
  const slug = pathname.replace(/\/$/, "").replace(/^\/journal\//, "");
  const article = findArticle(slug);

  useEffect(() => {
    if (!article) return;

    const path = `/journal/${article.slug}/`;
    const url = SITE.url + path;

    applyMeta({
      title: `${article.title} | River Fox Events`,
      description: article.metaDescription,
      path,
      ogImage: article.ogImage,
    });

    // BlogPosting JSON-LD — gives Google an article-specific signal.
    // Publisher uses the shared BUSINESS constant + alternateName so
    // search engines can connect "Lollipop Balloons" with the new brand.
    const blogPostingId = `rfx-jsonld-article-${article.slug}`;
    upsertJsonLd(blogPostingId, {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.metaDescription,
      image: SITE.url + (article.ogImage ?? SITE.defaultOgImage),
      datePublished: article.publishedAt,
      dateModified: article.updatedAt ?? article.publishedAt,
      author: {
        "@type": "Person",
        name: article.authorName ?? "Laura",
      },
      publisher: {
        "@type": "Organization",
        name: SITE.name,
        alternateName: "Lollipop Balloons",
        logo: {
          "@type": "ImageObject",
          url: SITE.url + SITE.defaultOgImage,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    });

    // BreadcrumbList: Home → Journal → This article
    const breadcrumbId = `rfx-jsonld-bc-article-${article.slug}`;
    upsertJsonLd(breadcrumbId, {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE.url + "/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Journal",
          item: SITE.url + "/journal/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: url,
        },
      ],
    });

    return () => {
      removeJsonLd(blogPostingId);
      removeJsonLd(breadcrumbId);
    };
  }, [article]);

  if (!article) return <NotFound />;

  const url = SITE.url + `/journal/${article.slug}/`;
  const Body = article.Body;
  const related = findRelated(article.slug);

  return (
    <div className="min-h-screen article-bg text-foreground">
      <ReadingProgress />
      <Nav />
      <main>
        <ArticleHero
          title={article.title}
          subtitle={article.subtitle}
          publishedAt={article.publishedAt}
          readMinutes={article.readMinutes}
          authorName={article.authorName}
          url={url}
        />

        {/* The body component is responsible for its own TL;DR, prose,
            images, pull-quotes and any inline CTAs. The end-of-article
            CTA + related-articles section are appended below. */}
        <Body />

        <ArticleCta
          heading={
            <>
              Plan your{" "}
              <em className="italic font-light text-accent-warm">
                celebration.
              </em>
            </>
          }
          body="Bespoke design, personally delivered by Laura across Surrey. Share your vision and we'll come back within 48 hours."
          label="Start planning"
          href="/#enquire"
        />

        <RelatedArticles items={related} />
      </main>
      <Footer />
    </div>
  );
};

export default Article;
