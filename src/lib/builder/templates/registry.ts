import type { PageTemplate } from './types';

import { lawHomeTemplate } from './law/law-home';
import { lawAboutTemplate } from './law/law-about';
import { lawServicesTemplate } from './law/law-services';
import { lawAttorneysTemplate } from './law/law-attorneys';
import { lawContactTemplate } from './law/law-contact';
import { lawCaseResultsTemplate } from './law/law-case-results';
import { lawFaqTemplate } from './law/law-faq';
import { lawBlogListTemplate } from './law/law-blog-list';
import { lawTestimonialsTemplate } from './law/law-testimonials';
import { lawPrivacyTemplate } from './law/law-privacy';

import { restaurantHomeTemplate } from './restaurant/restaurant-home';
import { restaurantMenuTemplate } from './restaurant/restaurant-menu';
import { restaurantAboutTemplate } from './restaurant/restaurant-about';
import { restaurantGalleryTemplate } from './restaurant/restaurant-gallery';
import { restaurantContactTemplate } from './restaurant/restaurant-contact';
import { restaurantEventsTemplate } from './restaurant/restaurant-events';
import { restaurantCateringTemplate } from './restaurant/restaurant-catering';
import { restaurantReviewsTemplate } from './restaurant/restaurant-reviews';
import { restaurantBlogTemplate } from './restaurant/restaurant-blog';
import { restaurantCareersTemplate } from './restaurant/restaurant-careers';

import { healthHomeTemplate } from './health/health-home';
import { healthServicesTemplate } from './health/health-services';
import { healthDoctorsTemplate } from './health/health-doctors';
import { healthAboutTemplate } from './health/health-about';
import { healthContactTemplate } from './health/health-contact';
import { healthFaqTemplate } from './health/health-faq';
import { healthTestimonialsTemplate } from './health/health-testimonials';
import { healthBlogTemplate } from './health/health-blog';
import { healthInsuranceTemplate } from './health/health-insurance';
import { healthCareersTemplate } from './health/health-careers';

import { realestateHomeTemplate } from './realestate/realestate-home';
import { realestateListingsTemplate } from './realestate/realestate-listings';
import { realestateAgentsTemplate } from './realestate/realestate-agents';
import { realestateAboutTemplate } from './realestate/realestate-about';
import { realestateContactTemplate } from './realestate/realestate-contact';
import { realestateBuyingTemplate } from './realestate/realestate-buying';
import { realestateSellingTemplate } from './realestate/realestate-selling';
import { realestateBlogTemplate } from './realestate/realestate-blog';
import { realestateNeighborhoodsTemplate } from './realestate/realestate-neighborhoods';
import { realestateTestimonialsTemplate } from './realestate/realestate-testimonials';

import { educationHomeTemplate } from './education/education-home';
import { educationProgramsTemplate } from './education/education-programs';
import { educationTeachersTemplate } from './education/education-teachers';
import { educationAboutTemplate } from './education/education-about';
import { educationContactTemplate } from './education/education-contact';
import { educationFaqTemplate } from './education/education-faq';
import { educationBlogTemplate } from './education/education-blog';
import { educationEventsTemplate } from './education/education-events';
import { educationGalleryTemplate } from './education/education-gallery';
import { educationTestimonialsTemplate } from './education/education-testimonials';

import { creativeHomeTemplate } from './creative/creative-home';
import { creativePortfolioTemplate } from './creative/creative-portfolio';
import { creativeServicesTemplate } from './creative/creative-services';
import { creativeAboutTemplate } from './creative/creative-about';
import { creativeContactTemplate } from './creative/creative-contact';
import { creativeTeamTemplate } from './creative/creative-team';
import { creativeBlogTemplate } from './creative/creative-blog';
import { creativeProcessTemplate } from './creative/creative-process';
import { creativePricingTemplate } from './creative/creative-pricing';
import { creativeTestimonialsTemplate } from './creative/creative-testimonials';

const allTemplates: PageTemplate[] = [
  // Law (10)
  lawHomeTemplate,
  lawAboutTemplate,
  lawServicesTemplate,
  lawAttorneysTemplate,
  lawContactTemplate,
  lawCaseResultsTemplate,
  lawFaqTemplate,
  lawBlogListTemplate,
  lawTestimonialsTemplate,
  lawPrivacyTemplate,

  // Restaurant (10)
  restaurantHomeTemplate,
  restaurantMenuTemplate,
  restaurantAboutTemplate,
  restaurantGalleryTemplate,
  restaurantContactTemplate,
  restaurantEventsTemplate,
  restaurantCateringTemplate,
  restaurantReviewsTemplate,
  restaurantBlogTemplate,
  restaurantCareersTemplate,

  // Health (10)
  healthHomeTemplate,
  healthServicesTemplate,
  healthDoctorsTemplate,
  healthAboutTemplate,
  healthContactTemplate,
  healthFaqTemplate,
  healthTestimonialsTemplate,
  healthBlogTemplate,
  healthInsuranceTemplate,
  healthCareersTemplate,

  // Real Estate (10)
  realestateHomeTemplate,
  realestateListingsTemplate,
  realestateAgentsTemplate,
  realestateAboutTemplate,
  realestateContactTemplate,
  realestateBuyingTemplate,
  realestateSellingTemplate,
  realestateBlogTemplate,
  realestateNeighborhoodsTemplate,
  realestateTestimonialsTemplate,

  // Education (10)
  educationHomeTemplate,
  educationProgramsTemplate,
  educationTeachersTemplate,
  educationAboutTemplate,
  educationContactTemplate,
  educationFaqTemplate,
  educationBlogTemplate,
  educationEventsTemplate,
  educationGalleryTemplate,
  educationTestimonialsTemplate,

  // Creative (10)
  creativeHomeTemplate,
  creativePortfolioTemplate,
  creativeServicesTemplate,
  creativeAboutTemplate,
  creativeContactTemplate,
  creativeTeamTemplate,
  creativeBlogTemplate,
  creativeProcessTemplate,
  creativePricingTemplate,
  creativeTestimonialsTemplate,
];

export function getAllTemplates(): PageTemplate[] {
  return allTemplates;
}

export function getTemplatesByCategory(
  category: PageTemplate['category'],
): PageTemplate[] {
  return allTemplates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): PageTemplate | undefined {
  return allTemplates.find((t) => t.id === id);
}
