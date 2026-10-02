/** Published renderer registry. Editor definitions and inspectors stay in registry.ts. */
import type { BuilderComponentDefinition } from './define';
import PublicText from '@/components/builder/canvas/elements/TextElement';
import PublicImage from '@/components/builder/canvas/elements/ImageElement';
import PublicButton from '@/components/builder/canvas/elements/ButtonElement';
import PublicHeading from './heading/Element';
import PublicContainer from './container/Element';
import PublicSection from './section/Element';
import PublicGallery from './gallery/GalleryRender';
import PublicVideo from './video/VideoRender';
import PublicVideoEmbed from './videoEmbed/VideoEmbedRender';
import PublicAudio from './audio/Render';
import PublicLottie from './lottie/Render';
import PublicMap from './map/Render';
import PublicCustomEmbed from './customEmbed/Render';
import PublicCodeBlock from './codeBlock/Render';
import PublicIcon from './icon/Render';
import PublicSpacer from './spacer/Render';
import PublicDivider from './divider/Render';
import PublicColumnCard from './columnCard/Render';
import PublicColumnList from './columnList/Render';
import PublicAttorneyCard from './attorneyCard/Render';
import PublicFaqList from './faqList/FaqListPublished';
import PublicContactForm from './contactForm/Render';
import PublicCtaBanner from './ctaBanner/Render';
import PublicBookingWidget from './bookingWidget/Element';
import PublicComposite from './composite/Render';
import PublicForm from './form/Element';
import PublicFormInput from './formInput/Element';
import PublicFormTextarea from './formTextarea/Element';
import PublicFormSubmit from './formSubmit/Element';
import PublicFormSelect from './formSelect/Element';
import PublicFormCheckbox from './formCheckbox/Element';
import PublicFormRadio from './formRadio/Element';
import PublicFormFile from './formFile/Element';
import PublicFormDate from './formDate/Element';
import PublicFormSignature from './formSignature/Render';
import PublicFormPayment from './formPayment/Render';
import PublicBlogFeed from './blogFeed/Element';
import PublicBlogPostCard from './blogPostCard/Element';
import PublicBlogCategories from './blogCategories/Element';
import PublicBlogArchive from './blogArchive/Element';
import PublicFeaturedPosts from './featuredPosts/Element';
import PublicBlogAuthor from './blogAuthor/Element';
import PublicBlogRecentPosts from './blogRecentPosts/Element';
import PublicEventList from './eventList/Element';
import PublicEventCalendar from './eventCalendar/Element';
import PublicEventRsvp from './eventRsvp/Element';
import PublicPortfolioList from './portfolioList/Element';
import PublicProductGallery from './productGallery/Element';
import PublicCountdown from './countdown/Render';
import PublicProgress from './progress/Render';
import PublicRating from './rating/Render';
import PublicNotificationBar from './notificationBar/Render';
import PublicBackToTop from './backToTop/Render';
import PublicMenuBar from './menuBar/MenuBarRender';
import PublicAnchorMenu from './anchorMenu/Render';
import PublicBreadcrumbs from './breadcrumbs/Render';
import PublicSocialBar from './socialBar/Render';
import PublicShareButtons from './shareButtons/Render';
import PublicSocialEmbed from './socialEmbed/Render';
import PublicFloatingChat from './floatingChat/Render';
import PublicAddressBlock from './addressBlock/Render';
import PublicBusinessHours from './businessHours/Render';
import PublicMultiLocationMap from './multiLocationMap/Render';
import PublicShape from './shape/Render';
import PublicPattern from './pattern/Render';
import PublicParallaxBg from './parallaxBg/Render';
import PublicFrame from './frame/Render';
import PublicSticker from './sticker/Render';
import PublicBarChart from './barChart/Render';
import PublicLineChart from './lineChart/Render';
import PublicPieChart from './pieChart/Render';
import PublicCounter from './counter/Render';
import PublicTestimonialCarousel from './testimonialCarousel/Render';
import PublicPricingTable from './pricingTable/Render';
import PublicComparisonTable from './comparisonTable/Render';
import PublicTimeline from './timeline/Render';
import PublicTeamMemberCard from './teamMemberCard/Render';
import PublicServiceFeatureCard from './serviceFeatureCard/Render';
import PublicSiteSearch from './siteSearch/Render';
import PublicMemberLogin from './memberLogin/Render';
import PublicMemberAccountSummary from './memberAccountSummary/Render';
import PublicMemberProfileForm from './memberProfileForm/Render';
import PublicMemberBookingsList from './memberBookingsList/Render';

const components: Record<string, Pick<BuilderComponentDefinition, 'Render'>> = {
  'text': { Render: PublicText },
  'image': { Render: PublicImage },
  'button': { Render: PublicButton },
  'heading': { Render: PublicHeading },
  'container': { Render: PublicContainer },
  'section': { Render: PublicSection },
  'gallery': { Render: PublicGallery },
  'video': { Render: PublicVideo },
  'video-embed': { Render: PublicVideoEmbed },
  'audio': { Render: PublicAudio },
  'lottie': { Render: PublicLottie },
  'map': { Render: PublicMap },
  'customEmbed': { Render: PublicCustomEmbed },
  'codeBlock': { Render: PublicCodeBlock },
  'icon': { Render: PublicIcon },
  'spacer': { Render: PublicSpacer },
  'divider': { Render: PublicDivider },
  'columnCard': { Render: PublicColumnCard },
  'columnList': { Render: PublicColumnList },
  'attorneyCard': { Render: PublicAttorneyCard },
  'faqList': { Render: PublicFaqList },
  'contactForm': { Render: PublicContactForm },
  'ctaBanner': { Render: PublicCtaBanner },
  'booking-widget': { Render: PublicBookingWidget },
  'composite': { Render: PublicComposite },
  'form': { Render: PublicForm },
  'form-input': { Render: PublicFormInput },
  'form-textarea': { Render: PublicFormTextarea },
  'form-submit': { Render: PublicFormSubmit },
  'form-select': { Render: PublicFormSelect },
  'form-checkbox': { Render: PublicFormCheckbox },
  'form-radio': { Render: PublicFormRadio },
  'form-file': { Render: PublicFormFile },
  'form-date': { Render: PublicFormDate },
  'form-signature': { Render: PublicFormSignature },
  'form-payment': { Render: PublicFormPayment },
  'blog-feed': { Render: PublicBlogFeed },
  'blog-post-card': { Render: PublicBlogPostCard },
  'blog-categories': { Render: PublicBlogCategories },
  'blog-archive': { Render: PublicBlogArchive },
  'featured-posts': { Render: PublicFeaturedPosts },
  'blog-author': { Render: PublicBlogAuthor },
  'blog-recent-posts': { Render: PublicBlogRecentPosts },
  'event-list': { Render: PublicEventList },
  'event-calendar': { Render: PublicEventCalendar },
  'event-rsvp': { Render: PublicEventRsvp },
  'portfolio-list': { Render: PublicPortfolioList },
  'product-gallery': { Render: PublicProductGallery },
  'countdown': { Render: PublicCountdown },
  'progress': { Render: PublicProgress },
  'rating': { Render: PublicRating },
  'notification-bar': { Render: PublicNotificationBar },
  'back-to-top': { Render: PublicBackToTop },
  'menu-bar': { Render: PublicMenuBar },
  'anchor-menu': { Render: PublicAnchorMenu },
  'breadcrumbs': { Render: PublicBreadcrumbs },
  'social-bar': { Render: PublicSocialBar },
  'share-buttons': { Render: PublicShareButtons },
  'social-embed': { Render: PublicSocialEmbed },
  'floating-chat': { Render: PublicFloatingChat },
  'address-block': { Render: PublicAddressBlock },
  'business-hours': { Render: PublicBusinessHours },
  'multi-location-map': { Render: PublicMultiLocationMap },
  'shape': { Render: PublicShape },
  'pattern': { Render: PublicPattern },
  'parallax-bg': { Render: PublicParallaxBg },
  'frame': { Render: PublicFrame },
  'sticker': { Render: PublicSticker },
  'bar-chart': { Render: PublicBarChart },
  'line-chart': { Render: PublicLineChart },
  'pie-chart': { Render: PublicPieChart },
  'counter': { Render: PublicCounter },
  'testimonial-carousel': { Render: PublicTestimonialCarousel },
  'pricing-table': { Render: PublicPricingTable },
  'comparison-table': { Render: PublicComparisonTable },
  'timeline': { Render: PublicTimeline },
  'team-member-card': { Render: PublicTeamMemberCard },
  'service-feature-card': { Render: PublicServiceFeatureCard },
  'site-search': { Render: PublicSiteSearch },
  'member-login': { Render: PublicMemberLogin },
  'member-account-summary': { Render: PublicMemberAccountSummary },
  'member-profile-form': { Render: PublicMemberProfileForm },
  'member-bookings-list': { Render: PublicMemberBookingsList },
};

export function getPublicComponent(kind: string) {
  return Object.prototype.hasOwnProperty.call(components, kind) ? components[kind] : undefined;
}
