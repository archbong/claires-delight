import BodyWrapper from "../layout/BodyWrapper";
import Paragraph from "../typography/Paragraph";
import Title from "../typography/Title";
import FutureService from "./our-service/FutureServices";
import ServiceCard from "./our-service/ServiceCard";
import ServiceContent from "./our-service/ServiceContent";
import { availableServices, futureServices } from "./our-service/data";

export default function OurService() {
  return (
    <BodyWrapper>
      {/* Title with green lines */}
      <div className="text-center my-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="block w-24 h-px bg-green" />
          <Title>{"Our Services"}</Title>
          <span className="block w-24 h-px bg-green" />
        </div>
        <Paragraph>
          A spice business can offer a variety of services beyond just selling spices.
          <br />
          Here's the gist:
        </Paragraph>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start px-4 lg:px-8">

        {/* Left: bullet points */}
        <div className="space-y-5 text-sm text-customBlack leading-7 lg:pt-10">
          <p>
            <span className="font-bold">Sell spices:</span> This is the core, but focus on quality, origin (local,
            organic?), and variety (whole, ground, blends).
          </p>
          <p>
            <span className="font-bold">Offer additional services:</span> Grinding, custom blends,
            subscriptions, educational content (recipes, workshops), gift
            baskets, wholesale options, or consulting.
          </p>
          <p>
            <span className="font-bold">Stand out:</span> Consider a niche focus (regional cuisine, unique
            blends) or sustainability practices.
          </p>
          <p>
            <span className="font-bold">Build a community:</span> Engage customers through online presence,
            events, and forums.
          </p>
        </div>

        {/* Right: service cards */}
        <div className="space-y-6">
          {/* Available Services */}
          <div>
            <h2 className="font-bold text-lg text-customBlack mb-4">Available Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableServices.map((service) => (
                <ServiceCard key={service.id}>
                  <ServiceContent
                    iconImage={service.image}
                    description={service.description}
                  />
                  <p className="px-4 pb-4 text-sm text-tertiaryGrey leading-6">
                    {service.content}
                  </p>
                </ServiceCard>
              ))}
            </div>
          </div>

          {/* Future Services */}
          <div>
            <h2 className="font-bold text-lg text-customBlack mb-4">Future Services</h2>
            <div className="grid grid-cols-3 gap-4">
              {futureServices.map((service) => (
                <ServiceCard key={service.id}>
                  <FutureService
                    imageIcon={service.image}
                    text={service.text}
                  />
                </ServiceCard>
              ))}
            </div>
          </div>
        </div>

      </div>
    </BodyWrapper>
  );
}
