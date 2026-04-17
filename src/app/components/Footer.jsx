// 'use client';

import Image from "next/image";
import "../styles/home.css";
import Link from "next/link";
import { getDataByParentId } from "@/utils/customFunctions";
import RatingComponent from "./smallComponents/RatingComponent";
import facebookicon from "@public/assets/images/social_icon/facebook.png";
import twittericon from "@public/assets/images/social_icon/twitter.png";
import tiktokicon from "@public/assets/images/social_icon/tiktok.png";
import instagramicon from "@public/assets/images/social_icon/instagram.png";
import logo from '@public/assets/images/logo.png'
import Script from "next/script";
import { fetchBlogs, getFallbackBlogs } from "@/lib/blogs";
import { slugify } from "@/utils/slugify";


const Footer = async ({ location_slug, configdata, menudata, reviewdata }) => {
  const extractBlogData = await fetchBlogs();

  if (!configdata?.length || !menudata?.length) return null;

  const {
    facebook,
    insta,
    twitter,
    tiktok,
    chatid,
  } = configdata[0] || {};

  const attractionsData = getDataByParentId(menudata, "attractions");
  const programsData = getDataByParentId(menudata, "programs");
  const groupsData = getDataByParentId(menudata, "group-events");
  const companyData = getDataByParentId(menudata, "about-us");
  const blogsData = getDataByParentId(menudata, "blogs");
  const companyChildren = companyData?.[0]?.children || [];
  const blogChildren = blogsData?.[0]?.children || [];
  const hasFooterContactLink = companyChildren.some(
    (item) => item?.path?.toLowerCase() === "contactus" && item?.isactive == 1,
  );
  const hasLatestNews = Array.isArray(extractBlogData) && extractBlogData.length > 0;
  const fallbackLatestNews = getFallbackBlogs().slice(0, 2);

  return (
    <footer className="aero_footer_section-bg">
      <section className="aero-max-container aero_footer_inner">
        <div className="aero_logo_social_wrap">
          <Link href={`/${location_slug}`} prefetch>
            <Image
              src={logo}
              alt="pixelpulseplay Logo"
              width={100}
              height={80}
              unoptimized
            />
          </Link>
          <div className="aero_footer_brand_copy">
            <strong>Pixel Pulse Play</strong>
            <p>Interactive game rooms, birthdays, groups, and next-level indoor play in Vaughan.</p>
          </div>
          <div className="aero_social_icon_wrap">
            {facebook && (
              <Link href={`https://www.facebook.com/${facebook}`} target="_blank" prefetch className="aero_social_icon">
                <Image src={facebookicon} alt="Facebook" height={50} width={50} unoptimized />
              </Link>
            )}
            {twitter && (
              <Link href={`https://x.com/${twitter}`} target="_blank" prefetch className="aero_social_icon">
                <Image src={twittericon} alt="Twitter" height={50} width={50} unoptimized />
              </Link>
            )}
            {insta && (
              <Link href={`https://www.instagram.com/${insta}`} target="_blank" prefetch className="aero_social_icon">
                <Image src={instagramicon} alt="Instagram" height={50} width={50} unoptimized />
              </Link>
            )}
            {tiktok && (
              <Link href={`https://www.tiktok.com/${tiktok}`} target="_blank" prefetch className="aero_social_icon">
                <Image src={tiktokicon} alt="TikTok" height={50} width={50} unoptimized />
              </Link>
            )}
          </div>
        </div>

        <section className="aero_footer_col-4-wrapper">
          <ul>
            <li>Attractions</li>
            {attractionsData?.[0]?.children?.map((item, i) => (
              <li key={i}>
                <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                  {item?.desc}
                </Link>
              </li>
            ))}
          </ul>
          {/* {
            programsData?.length > 0 && (<ul>
              <li>Programs</li>
              {programsData?.[0]?.children?.map((item, i) => (
                <li key={i}>
                  <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                    {item?.desc}
                  </Link>
                </li>
              ))} */}
              <ul>
              {companyData?.[0]?.children?.length > 0 && (
                <>
                  <li>Company</li>
                  {companyData[0].children.map((item, i) => (
                    item?.isactive == 1 && (
                      <li key={i}>
                        <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                          {item?.desc}
                        </Link>
                      </li>
                    )
                  ))}
                  {!hasFooterContactLink && (
                    <li>
                      <Link href={`/${location_slug}/contactus`} prefetch>
                        Contact Us
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
            {/* )
          } */}

          <ul>
            <li>Groups</li>
            {groupsData?.[0]?.children?.map((item, i) => (
              <li key={i}>
                <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                  {item?.desc}
                </Link>
              </li>
            ))}
          </ul>
          <ul>
            <li>Blogs</li>
            <li>
              <Link href="/blogs" prefetch>
                All Blogs
              </Link>
            </li>
            {blogChildren.map((item, i) => (
              item?.isactive == 1 && (
                <li key={i}>
                  <Link href={`/${location_slug}/${item?.parentid}/${item?.path}`} prefetch>
                    {item?.desc}
                  </Link>
                </li>
              )
            ))}
          </ul>
          <ul>
            <li>Latest News</li>
            {hasLatestNews ? (
              extractBlogData.slice(0, 4).map((item, i) => {
                const slug = slugify(item.title);
                return (
                  <li key={i}>
                    <Link href={`/blogs/${slug}?uid=${item.id}`} prefetch>
                      <article className="d-flex-center aero_footer_article-card">
                        <Image
                          src={
                            item?.featuredImage ||
                            "https://storage.googleapis.com/aerosports/common/gallery-thummbnail-wall-climbwall.jpg"
                          }
                          alt={item?.title}
                          title={item?.title}
                          width={50}
                          height={50}
                          unoptimized
                        />
                        <div>
                          <h6>
                            {item?.updatedAt?.seconds
                              ? new Date(item.updatedAt.seconds * 1000).toDateString()
                              : "Latest Update"}
                          </h6>
                          <p>{item?.title}</p>
                        </div>
                      </article>
                    </Link>
                  </li>
                );
              })
            ) : (
              fallbackLatestNews.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} prefetch>
                    <article className="d-flex-center aero_footer_article-card">
                      <Image
                        src={item.featuredImage}
                        alt={item.title}
                        title={item.title}
                        width={50}
                        height={50}
                        unoptimized
                      />
                      <div>
                        <h6>Latest Update</h6>
                        <p>{item.title}</p>
                      </div>
                    </article>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </section>

      {/* Chat Script */}
      {/* {chatid && (
        <Script
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id={chatid}
          strategy="afterInteractive"
        />
      )} */}
    </footer>
  );
};

export default Footer;
