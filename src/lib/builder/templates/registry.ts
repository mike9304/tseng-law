import type { PageTemplate, TemplateCatalogItem } from './types';
import { createTemplateCatalogItem, enrichTemplate } from './metadata';

import { lawAboutTemplate } from './law/law-about';
import { lawAttorneysTemplate } from './law/law-attorneys';
import { lawBlogListTemplate } from './law/law-blog-list';
import { lawCaseResultsTemplate } from './law/law-case-results';
import { lawContactTemplate } from './law/law-contact';
import { lawFaqTemplate } from './law/law-faq';
import { lawHomeTemplate } from './law/law-home';
import { lawPrivacyTemplate } from './law/law-privacy';
import { lawServicesTemplate } from './law/law-services';
import { lawTestimonialsTemplate } from './law/law-testimonials';

import { restaurantAboutTemplate } from './restaurant/restaurant-about';
import { restaurantBlogTemplate } from './restaurant/restaurant-blog';
import { restaurantCareersTemplate } from './restaurant/restaurant-careers';
import { restaurantCateringTemplate } from './restaurant/restaurant-catering';
import { restaurantContactTemplate } from './restaurant/restaurant-contact';
import { restaurantEventsTemplate } from './restaurant/restaurant-events';
import { restaurantGalleryTemplate } from './restaurant/restaurant-gallery';
import { restaurantHomeTemplate } from './restaurant/restaurant-home';
import { restaurantMenuTemplate } from './restaurant/restaurant-menu';
import { restaurantReviewsTemplate } from './restaurant/restaurant-reviews';

import { healthAboutTemplate } from './health/health-about';
import { healthBlogTemplate } from './health/health-blog';
import { healthCareersTemplate } from './health/health-careers';
import { healthContactTemplate } from './health/health-contact';
import { healthDoctorsTemplate } from './health/health-doctors';
import { healthFaqTemplate } from './health/health-faq';
import { healthHomeTemplate } from './health/health-home';
import { healthInsuranceTemplate } from './health/health-insurance';
import { healthServicesTemplate } from './health/health-services';
import { healthTestimonialsTemplate } from './health/health-testimonials';

import { realestateAboutTemplate } from './realestate/realestate-about';
import { realestateAgentsTemplate } from './realestate/realestate-agents';
import { realestateBlogTemplate } from './realestate/realestate-blog';
import { realestateBuyingTemplate } from './realestate/realestate-buying';
import { realestateContactTemplate } from './realestate/realestate-contact';
import { realestateHomeTemplate } from './realestate/realestate-home';
import { realestateListingsTemplate } from './realestate/realestate-listings';
import { realestateNeighborhoodsTemplate } from './realestate/realestate-neighborhoods';
import { realestateSellingTemplate } from './realestate/realestate-selling';
import { realestateTestimonialsTemplate } from './realestate/realestate-testimonials';

import { educationAboutTemplate } from './education/education-about';
import { educationBlogTemplate } from './education/education-blog';
import { educationContactTemplate } from './education/education-contact';
import { educationEventsTemplate } from './education/education-events';
import { educationFaqTemplate } from './education/education-faq';
import { educationGalleryTemplate } from './education/education-gallery';
import { educationHomeTemplate } from './education/education-home';
import { educationProgramsTemplate } from './education/education-programs';
import { educationTeachersTemplate } from './education/education-teachers';
import { educationTestimonialsTemplate } from './education/education-testimonials';

import { creativeAboutTemplate } from './creative/creative-about';
import { creativeBlogTemplate } from './creative/creative-blog';
import { creativeContactTemplate } from './creative/creative-contact';
import { creativeHomeTemplate } from './creative/creative-home';
import { creativePortfolioTemplate } from './creative/creative-portfolio';
import { creativePricingTemplate } from './creative/creative-pricing';
import { creativeProcessTemplate } from './creative/creative-process';
import { creativeServicesTemplate } from './creative/creative-services';
import { creativeTeamTemplate } from './creative/creative-team';
import { creativeTestimonialsTemplate } from './creative/creative-testimonials';

import { beautyAboutTemplate } from './beauty/beauty-about';
import { beautyBlogTemplate } from './beauty/beauty-blog';
import { beautyContactTemplate } from './beauty/beauty-contact';
import { beautyGalleryTemplate } from './beauty/beauty-gallery';
import { beautyHomeTemplate } from './beauty/beauty-home';
import { beautyPricingTemplate } from './beauty/beauty-pricing';
import { beautyProductsTemplate } from './beauty/beauty-products';
import { beautyServicesTemplate } from './beauty/beauty-services';
import { beautyTeamTemplate } from './beauty/beauty-team';
import { beautyTestimonialsTemplate } from './beauty/beauty-testimonials';

import { blogAboutTemplate } from './blog/blog-about';
import { blogArchiveTemplate } from './blog/blog-archive';
import { blogArticleTemplate } from './blog/blog-article';
import { blogAuthorsTemplate } from './blog/blog-authors';
import { blogCategoryTemplate } from './blog/blog-category';
import { blogContactTemplate } from './blog/blog-contact';
import { blogHomeTemplate } from './blog/blog-home';
import { blogNewsletterTemplate } from './blog/blog-newsletter';
import { blogPodcastTemplate } from './blog/blog-podcast';
import { blogResourcesTemplate } from './blog/blog-resources';

import { cafeAboutTemplate } from './cafe/cafe-about';
import { cafeBlogTemplate } from './cafe/cafe-blog';
import { cafeCareersTemplate } from './cafe/cafe-careers';
import { cafeCateringTemplate } from './cafe/cafe-catering';
import { cafeContactTemplate } from './cafe/cafe-contact';
import { cafeEventsTemplate } from './cafe/cafe-events';
import { cafeGalleryTemplate } from './cafe/cafe-gallery';
import { cafeHomeTemplate } from './cafe/cafe-home';
import { cafeLoyaltyTemplate } from './cafe/cafe-loyalty';
import { cafeMenuTemplate } from './cafe/cafe-menu';

import { consultingAboutTemplate } from './consulting/consulting-about';
import { consultingBlogTemplate } from './consulting/consulting-blog';
import { consultingCareersTemplate } from './consulting/consulting-careers';
import { consultingCaseStudiesTemplate } from './consulting/consulting-case-studies';
import { consultingContactTemplate } from './consulting/consulting-contact';
import { consultingHomeTemplate } from './consulting/consulting-home';
import { consultingPricingTemplate } from './consulting/consulting-pricing';
import { consultingServicesTemplate } from './consulting/consulting-services';
import { consultingTeamTemplate } from './consulting/consulting-team';
import { consultingTestimonialsTemplate } from './consulting/consulting-testimonials';

import { ecommerceAboutTemplate } from './ecommerce/ecommerce-about';
import { ecommerceBlogTemplate } from './ecommerce/ecommerce-blog';
import { ecommerceContactTemplate } from './ecommerce/ecommerce-contact';
import { ecommerceFaqTemplate } from './ecommerce/ecommerce-faq';
import { ecommerceHomeTemplate } from './ecommerce/ecommerce-home';
import { ecommerceProductDetailTemplate } from './ecommerce/ecommerce-product-detail';
import { ecommerceProductsTemplate } from './ecommerce/ecommerce-products';
import { ecommerceReviewsTemplate } from './ecommerce/ecommerce-reviews';
import { ecommerceSaleTemplate } from './ecommerce/ecommerce-sale';
import { ecommerceShippingTemplate } from './ecommerce/ecommerce-shipping';

import { fitnessAboutTemplate } from './fitness/fitness-about';
import { fitnessBlogTemplate } from './fitness/fitness-blog';
import { fitnessClassesTemplate } from './fitness/fitness-classes';
import { fitnessContactTemplate } from './fitness/fitness-contact';
import { fitnessGalleryTemplate } from './fitness/fitness-gallery';
import { fitnessHomeTemplate } from './fitness/fitness-home';
import { fitnessNutritionTemplate } from './fitness/fitness-nutrition';
import { fitnessPricingTemplate } from './fitness/fitness-pricing';
import { fitnessTestimonialsTemplate } from './fitness/fitness-testimonials';
import { fitnessTrainersTemplate } from './fitness/fitness-trainers';

import { musicAboutTemplate } from './music/music-about';
import { musicContactTemplate } from './music/music-contact';
import { musicDiscographyTemplate } from './music/music-discography';
import { musicGalleryTemplate } from './music/music-gallery';
import { musicHomeTemplate } from './music/music-home';
import { musicLyricsTemplate } from './music/music-lyrics';
import { musicMerchTemplate } from './music/music-merch';
import { musicPressTemplate } from './music/music-press';
import { musicTourTemplate } from './music/music-tour';
import { musicVideosTemplate } from './music/music-videos';

import { petAboutTemplate } from './pet/pet-about';
import { petBlogTemplate } from './pet/pet-blog';
import { petContactTemplate } from './pet/pet-contact';
import { petFaqTemplate } from './pet/pet-faq';
import { petGalleryTemplate } from './pet/pet-gallery';
import { petHomeTemplate } from './pet/pet-home';
import { petPricingTemplate } from './pet/pet-pricing';
import { petServicesTemplate } from './pet/pet-services';
import { petTeamTemplate } from './pet/pet-team';
import { petTestimonialsTemplate } from './pet/pet-testimonials';

import { photographyAboutTemplate } from './photography/photography-about';
import { photographyBlogTemplate } from './photography/photography-blog';
import { photographyContactTemplate } from './photography/photography-contact';
import { photographyGalleryPortraitTemplate } from './photography/photography-gallery-portrait';
import { photographyGalleryWeddingTemplate } from './photography/photography-gallery-wedding';
import { photographyHomeTemplate } from './photography/photography-home';
import { photographyPortfolioTemplate } from './photography/photography-portfolio';
import { photographyPricingTemplate } from './photography/photography-pricing';
import { photographyServicesTemplate } from './photography/photography-services';
import { photographyTestimonialsTemplate } from './photography/photography-testimonials';

import { startupAboutTemplate } from './startup/startup-about';
import { startupBlogTemplate } from './startup/startup-blog';
import { startupCareersTemplate } from './startup/startup-careers';
import { startupChangelogTemplate } from './startup/startup-changelog';
import { startupContactTemplate } from './startup/startup-contact';
import { startupFeaturesTemplate } from './startup/startup-features';
import { startupHomeTemplate } from './startup/startup-home';
import { startupIntegrationsTemplate } from './startup/startup-integrations';
import { startupPricingTemplate } from './startup/startup-pricing';
import { startupTestimonialsTemplate } from './startup/startup-testimonials';

import { travelAboutTemplate } from './travel/travel-about';
import { travelBlogTemplate } from './travel/travel-blog';
import { travelContactTemplate } from './travel/travel-contact';
import { travelDestinationsTemplate } from './travel/travel-destinations';
import { travelFaqTemplate } from './travel/travel-faq';
import { travelGalleryTemplate } from './travel/travel-gallery';
import { travelGuidesTemplate } from './travel/travel-guides';
import { travelHomeTemplate } from './travel/travel-home';
import { travelPackagesTemplate } from './travel/travel-packages';
import { travelReviewsTemplate } from './travel/travel-reviews';

// Track C — New category templates
import { agencyHomeTemplate } from './agency/agency-home';
import { agencyAboutTemplate } from './agency/agency-about';
import { agencyServicesTemplate } from './agency/agency-services';
import { agencyWorkTemplate } from './agency/agency-work';
import { agencyCaseStudyTemplate } from './agency/agency-case-study';
import { agencyTeamTemplate } from './agency/agency-team';
import { agencyContactTemplate } from './agency/agency-contact';
import { saasHomeTemplate } from './saas/saas-home';
import { saasFeaturesTemplate } from './saas/saas-features';
import { saasPricingTemplate } from './saas/saas-pricing';
import { saasIntegrationsTemplate } from './saas/saas-integrations';
import { saasChangelogTemplate } from './saas/saas-changelog';
import { saasCustomersTemplate } from './saas/saas-customers';
import { saasContactTemplate } from './saas/saas-contact';
import { nonprofitHomeTemplate } from './nonprofit/nonprofit-home';
import { nonprofitMissionTemplate } from './nonprofit/nonprofit-mission';
import { nonprofitProgramsTemplate } from './nonprofit/nonprofit-programs';
import { nonprofitDonateTemplate } from './nonprofit/nonprofit-donate';
import { nonprofitVolunteerTemplate } from './nonprofit/nonprofit-volunteer';
import { nonprofitEventsTemplate } from './nonprofit/nonprofit-events';
import { nonprofitContactTemplate } from './nonprofit/nonprofit-contact';
import { conferenceHomeTemplate } from './conference/conference-home';
import { conferenceAgendaTemplate } from './conference/conference-agenda';
import { conferenceSpeakersTemplate } from './conference/conference-speakers';
import { conferenceSponsorsTemplate } from './conference/conference-sponsors';
import { conferenceVenueTemplate } from './conference/conference-venue';
import { conferenceRegisterTemplate } from './conference/conference-register';
import { conferenceFaqTemplate } from './conference/conference-faq';
import { podcastHomeTemplate } from './podcast/podcast-home';
import { podcastEpisodesTemplate } from './podcast/podcast-episodes';
import { podcastAboutTemplate } from './podcast/podcast-about';
import { podcastHostsTemplate } from './podcast/podcast-hosts';
import { podcastSubscribeTemplate } from './podcast/podcast-subscribe';
import { podcastContactTemplate } from './podcast/podcast-contact';
import { podcastSponsorsTemplate } from './podcast/podcast-sponsors';
import { magazineHomeTemplate } from './magazine/magazine-home';
import { magazineIssueTemplate } from './magazine/magazine-issue';
import { magazineArticlesTemplate } from './magazine/magazine-articles';
import { magazineAuthorsTemplate } from './magazine/magazine-authors';
import { magazineAboutTemplate } from './magazine/magazine-about';
import { magazineSubscribeTemplate } from './magazine/magazine-subscribe';
import { magazineContactTemplate } from './magazine/magazine-contact';
import { dentalHomeTemplate } from './dental/dental-home';
import { dentalAboutTemplate } from './dental/dental-about';
import { dentalServicesTemplate } from './dental/dental-services';
import { dentalTeamTemplate } from './dental/dental-team';
import { dentalBookingTemplate } from './dental/dental-booking';
import { dentalInsuranceTemplate } from './dental/dental-insurance';
import { dentalContactTemplate } from './dental/dental-contact';
import { yogaHomeTemplate } from './yoga/yoga-home';
import { yogaClassesTemplate } from './yoga/yoga-classes';
import { yogaInstructorsTemplate } from './yoga/yoga-instructors';
import { yogaScheduleTemplate } from './yoga/yoga-schedule';
import { yogaPricingTemplate } from './yoga/yoga-pricing';
import { yogaAboutTemplate } from './yoga/yoga-about';
import { yogaContactTemplate } from './yoga/yoga-contact';
import { portfolioHomeTemplate } from './portfolio/portfolio-home';
import { portfolioAboutTemplate } from './portfolio/portfolio-about';
import { portfolioWorkTemplate } from './portfolio/portfolio-work';
import { portfolioCaseStudyTemplate } from './portfolio/portfolio-case-study';
import { portfolioProcessTemplate } from './portfolio/portfolio-process';
import { portfolioContactTemplate } from './portfolio/portfolio-contact';
import { portfolioCvTemplate } from './portfolio/portfolio-cv';
import { freelancerHomeTemplate } from './freelancer/freelancer-home';
import { freelancerServicesTemplate } from './freelancer/freelancer-services';
import { freelancerPortfolioTemplate } from './freelancer/freelancer-portfolio';
import { freelancerPricingTemplate } from './freelancer/freelancer-pricing';
import { freelancerTestimonialsTemplate } from './freelancer/freelancer-testimonials';
import { freelancerAboutTemplate } from './freelancer/freelancer-about';
import { freelancerContactTemplate } from './freelancer/freelancer-contact';
import { weddingHomeTemplate } from './wedding/wedding-home';
import { weddingServicesTemplate } from './wedding/wedding-services';
import { weddingPortfolioTemplate } from './wedding/wedding-portfolio';
import { weddingPricingTemplate } from './wedding/wedding-pricing';
import { weddingAboutTemplate } from './wedding/wedding-about';
import { weddingContactTemplate } from './wedding/wedding-contact';
import { weddingTestimonialsTemplate } from './wedding/wedding-testimonials';
import { carrentalHomeTemplate } from './carrental/carrental-home';
import { carrentalFleetTemplate } from './carrental/carrental-fleet';
import { carrentalLocationsTemplate } from './carrental/carrental-locations';
import { carrentalPricingTemplate } from './carrental/carrental-pricing';
import { carrentalAboutTemplate } from './carrental/carrental-about';
import { carrentalContactTemplate } from './carrental/carrental-contact';
import { carrentalInsuranceTemplate } from './carrental/carrental-insurance';
import { eventplannerHomeTemplate } from './eventplanner/eventplanner-home';
import { eventplannerServicesTemplate } from './eventplanner/eventplanner-services';
import { eventplannerPortfolioTemplate } from './eventplanner/eventplanner-portfolio';
import { eventplannerVenuesTemplate } from './eventplanner/eventplanner-venues';
import { eventplannerAboutTemplate } from './eventplanner/eventplanner-about';
import { eventplannerContactTemplate } from './eventplanner/eventplanner-contact';
import { eventplannerPackagesTemplate } from './eventplanner/eventplanner-packages';

export interface TemplateCategory {
  id: PageTemplate['category'];
  count: number;
}

const allTemplates: PageTemplate[] = [
  // Law (10)
  lawAboutTemplate,
  lawAttorneysTemplate,
  lawBlogListTemplate,
  lawCaseResultsTemplate,
  lawContactTemplate,
  lawFaqTemplate,
  lawHomeTemplate,
  lawPrivacyTemplate,
  lawServicesTemplate,
  lawTestimonialsTemplate,

  // Restaurant (10)
  restaurantAboutTemplate,
  restaurantBlogTemplate,
  restaurantCareersTemplate,
  restaurantCateringTemplate,
  restaurantContactTemplate,
  restaurantEventsTemplate,
  restaurantGalleryTemplate,
  restaurantHomeTemplate,
  restaurantMenuTemplate,
  restaurantReviewsTemplate,

  // Health (10)
  healthAboutTemplate,
  healthBlogTemplate,
  healthCareersTemplate,
  healthContactTemplate,
  healthDoctorsTemplate,
  healthFaqTemplate,
  healthHomeTemplate,
  healthInsuranceTemplate,
  healthServicesTemplate,
  healthTestimonialsTemplate,

  // Real Estate (10)
  realestateAboutTemplate,
  realestateAgentsTemplate,
  realestateBlogTemplate,
  realestateBuyingTemplate,
  realestateContactTemplate,
  realestateHomeTemplate,
  realestateListingsTemplate,
  realestateNeighborhoodsTemplate,
  realestateSellingTemplate,
  realestateTestimonialsTemplate,

  // Education (10)
  educationAboutTemplate,
  educationBlogTemplate,
  educationContactTemplate,
  educationEventsTemplate,
  educationFaqTemplate,
  educationGalleryTemplate,
  educationHomeTemplate,
  educationProgramsTemplate,
  educationTeachersTemplate,
  educationTestimonialsTemplate,

  // Creative (10)
  creativeAboutTemplate,
  creativeBlogTemplate,
  creativeContactTemplate,
  creativeHomeTemplate,
  creativePortfolioTemplate,
  creativePricingTemplate,
  creativeProcessTemplate,
  creativeServicesTemplate,
  creativeTeamTemplate,
  creativeTestimonialsTemplate,

  // Beauty (10)
  beautyAboutTemplate,
  beautyBlogTemplate,
  beautyContactTemplate,
  beautyGalleryTemplate,
  beautyHomeTemplate,
  beautyPricingTemplate,
  beautyProductsTemplate,
  beautyServicesTemplate,
  beautyTeamTemplate,
  beautyTestimonialsTemplate,

  // Blog (10)
  blogAboutTemplate,
  blogArchiveTemplate,
  blogArticleTemplate,
  blogAuthorsTemplate,
  blogCategoryTemplate,
  blogContactTemplate,
  blogHomeTemplate,
  blogNewsletterTemplate,
  blogPodcastTemplate,
  blogResourcesTemplate,

  // Cafe (10)
  cafeAboutTemplate,
  cafeBlogTemplate,
  cafeCareersTemplate,
  cafeCateringTemplate,
  cafeContactTemplate,
  cafeEventsTemplate,
  cafeGalleryTemplate,
  cafeHomeTemplate,
  cafeLoyaltyTemplate,
  cafeMenuTemplate,

  // Consulting (10)
  consultingAboutTemplate,
  consultingBlogTemplate,
  consultingCareersTemplate,
  consultingCaseStudiesTemplate,
  consultingContactTemplate,
  consultingHomeTemplate,
  consultingPricingTemplate,
  consultingServicesTemplate,
  consultingTeamTemplate,
  consultingTestimonialsTemplate,

  // Ecommerce (10)
  ecommerceAboutTemplate,
  ecommerceBlogTemplate,
  ecommerceContactTemplate,
  ecommerceFaqTemplate,
  ecommerceHomeTemplate,
  ecommerceProductDetailTemplate,
  ecommerceProductsTemplate,
  ecommerceReviewsTemplate,
  ecommerceSaleTemplate,
  ecommerceShippingTemplate,

  // Fitness (10)
  fitnessAboutTemplate,
  fitnessBlogTemplate,
  fitnessClassesTemplate,
  fitnessContactTemplate,
  fitnessGalleryTemplate,
  fitnessHomeTemplate,
  fitnessNutritionTemplate,
  fitnessPricingTemplate,
  fitnessTestimonialsTemplate,
  fitnessTrainersTemplate,

  // Music (10)
  musicAboutTemplate,
  musicContactTemplate,
  musicDiscographyTemplate,
  musicGalleryTemplate,
  musicHomeTemplate,
  musicLyricsTemplate,
  musicMerchTemplate,
  musicPressTemplate,
  musicTourTemplate,
  musicVideosTemplate,

  // Pet (10)
  petAboutTemplate,
  petBlogTemplate,
  petContactTemplate,
  petFaqTemplate,
  petGalleryTemplate,
  petHomeTemplate,
  petPricingTemplate,
  petServicesTemplate,
  petTeamTemplate,
  petTestimonialsTemplate,

  // Photography (10)
  photographyAboutTemplate,
  photographyBlogTemplate,
  photographyContactTemplate,
  photographyGalleryPortraitTemplate,
  photographyGalleryWeddingTemplate,
  photographyHomeTemplate,
  photographyPortfolioTemplate,
  photographyPricingTemplate,
  photographyServicesTemplate,
  photographyTestimonialsTemplate,

  // Startup (10)
  startupAboutTemplate,
  startupBlogTemplate,
  startupCareersTemplate,
  startupChangelogTemplate,
  startupContactTemplate,
  startupFeaturesTemplate,
  startupHomeTemplate,
  startupIntegrationsTemplate,
  startupPricingTemplate,
  startupTestimonialsTemplate,

  // Travel (10)
  travelAboutTemplate,
  travelBlogTemplate,
  travelContactTemplate,
  travelDestinationsTemplate,
  travelFaqTemplate,
  travelGalleryTemplate,
  travelGuidesTemplate,
  travelHomeTemplate,
  travelPackagesTemplate,
  travelReviewsTemplate,
  // Track C — Agency (7)
  agencyHomeTemplate,
  agencyAboutTemplate,
  agencyServicesTemplate,
  agencyWorkTemplate,
  agencyCaseStudyTemplate,
  agencyTeamTemplate,
  agencyContactTemplate,

  // Track C — Saas (7)
  saasHomeTemplate,
  saasFeaturesTemplate,
  saasPricingTemplate,
  saasIntegrationsTemplate,
  saasChangelogTemplate,
  saasCustomersTemplate,
  saasContactTemplate,

  // Track C — Nonprofit (7)
  nonprofitHomeTemplate,
  nonprofitMissionTemplate,
  nonprofitProgramsTemplate,
  nonprofitDonateTemplate,
  nonprofitVolunteerTemplate,
  nonprofitEventsTemplate,
  nonprofitContactTemplate,

  // Track C — Conference (7)
  conferenceHomeTemplate,
  conferenceAgendaTemplate,
  conferenceSpeakersTemplate,
  conferenceSponsorsTemplate,
  conferenceVenueTemplate,
  conferenceRegisterTemplate,
  conferenceFaqTemplate,

  // Track C — Podcast (7)
  podcastHomeTemplate,
  podcastEpisodesTemplate,
  podcastAboutTemplate,
  podcastHostsTemplate,
  podcastSubscribeTemplate,
  podcastContactTemplate,
  podcastSponsorsTemplate,

  // Track C — Magazine (7)
  magazineHomeTemplate,
  magazineIssueTemplate,
  magazineArticlesTemplate,
  magazineAuthorsTemplate,
  magazineAboutTemplate,
  magazineSubscribeTemplate,
  magazineContactTemplate,

  // Track C — Dental (7)
  dentalHomeTemplate,
  dentalAboutTemplate,
  dentalServicesTemplate,
  dentalTeamTemplate,
  dentalBookingTemplate,
  dentalInsuranceTemplate,
  dentalContactTemplate,

  // Track C — Yoga (7)
  yogaHomeTemplate,
  yogaClassesTemplate,
  yogaInstructorsTemplate,
  yogaScheduleTemplate,
  yogaPricingTemplate,
  yogaAboutTemplate,
  yogaContactTemplate,

  // Track C — Portfolio (7)
  portfolioHomeTemplate,
  portfolioAboutTemplate,
  portfolioWorkTemplate,
  portfolioCaseStudyTemplate,
  portfolioProcessTemplate,
  portfolioContactTemplate,
  portfolioCvTemplate,

  // Track C — Freelancer (7)
  freelancerHomeTemplate,
  freelancerServicesTemplate,
  freelancerPortfolioTemplate,
  freelancerPricingTemplate,
  freelancerTestimonialsTemplate,
  freelancerAboutTemplate,
  freelancerContactTemplate,

  // Track C — Wedding (7)
  weddingHomeTemplate,
  weddingServicesTemplate,
  weddingPortfolioTemplate,
  weddingPricingTemplate,
  weddingAboutTemplate,
  weddingContactTemplate,
  weddingTestimonialsTemplate,

  // Track C — Carrental (7)
  carrentalHomeTemplate,
  carrentalFleetTemplate,
  carrentalLocationsTemplate,
  carrentalPricingTemplate,
  carrentalAboutTemplate,
  carrentalContactTemplate,
  carrentalInsuranceTemplate,

  // Track C — Eventplanner (7)
  eventplannerHomeTemplate,
  eventplannerServicesTemplate,
  eventplannerPortfolioTemplate,
  eventplannerVenuesTemplate,
  eventplannerAboutTemplate,
  eventplannerContactTemplate,
  eventplannerPackagesTemplate,

];

export function getAllTemplates(): PageTemplate[] {
  return allTemplates.map(enrichTemplate);
}

export function getTemplateCategories(): TemplateCategory[] {
  const counts = new Map<PageTemplate['category'], number>();
  for (const template of allTemplates) {
    counts.set(template.category, (counts.get(template.category) ?? 0) + 1);
  }
  return Array.from(counts, ([id, count]) => ({ id, count }));
}

export function getTemplatesByCategory(
  category: PageTemplate['category'],
): PageTemplate[] {
  return getAllTemplates().filter((t) => t.category === category);
}

export function getTemplateById(id: string): PageTemplate | undefined {
  const template = allTemplates.find((t) => t.id === id);
  return template ? enrichTemplate(template) : undefined;
}

export function getTemplateCatalog(): TemplateCatalogItem[] {
  return allTemplates.map(createTemplateCatalogItem);
}
