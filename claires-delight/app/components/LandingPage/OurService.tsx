import BodyWrapper from "../layout/BodyWrapper";
import Paragraph from "../typography/Paragraph";
import Title from "../typography/Title";
import FutureService from "./our-service/FutureServices";
import ServiceCard from "./our-service/ServiceCard";
import ServiceContent from "./our-service/ServiceContent";
import { availableServices, futureServices } from "./our-service/data";

export default function Ourservice() {
  return (
    <BodyWrapper>
      <div className="p-5">
      <Title>{"Our Service"}</Title>
      </div>
      <Paragraph>
        {
          "A spice business can offer a variety of services beyond just selling spices. Here's the gist."
        }
      </Paragraph>
      <div className="md:mt-5 grid grid-cols-1 md:grid-cols-2 place-content-center place-items-center">
        <div className="md:m-10 lg:m-10 p-5">
          <p className="md:p-3 lg:p-3">
            <span className="font-bold">Sell spices:</span> This is the core,
            but focus on quality, origin (local, <br /> organic?), and variety (whole,
            ground, blends),
          </p>
          <p className="md:p-3 lg:p-3">
            <span className="font-bold">Offer additional services:</span> Grinding, custom blends,<br />
            subscriptions, educational content (recipes, workshops), gift<br />
            baskets, wholesale options, or consulting.
          </p>
          <p className="md:p-3 lg:p-3">
            <span className="font-bold">Stand out:</span> Consider a niche focus (regional cusine, unique<br />
            blends) or sustainability practices.
          </p>
          <p className="md:p-3 lg:p-3">
            <span className="font-bold">Build a community:</span> Engage customers through online presence,<br />
            events, and forums.
          </p>
        </div>
        <div className="p-5">
          <div>
            <h2 className="pb-5 lg:py-5 md:py-5 font-bold">Available Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 place-items-center">
              {/* card  */}
              {availableServices.map((service) => (
                <ServiceCard key={service.id} className="lg:w-[21rem] lg:h-[13rem]">
                  <ServiceContent
                    iconImage={service.image}
                    description={service.description}
                  />
                  <p className="text-center py-1">{service.content}</p>
                </ServiceCard>
              ))}
            </div>
          </div>
          <div className="py-5">
            <h2 className="pb-5 md:py-5 font-bold">Future Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 place-content-center place-items-center">
              {futureServices.map((service) => (
                <ServiceCard className="w-[12rem] md:w-[14rem] md:h-[10rem] h-[10rem]" key={service.id}>
                  <FutureService className="md:w-[15rem] md:h-[15rem] flex flex-col"
                    imageIcon={service.image}
                    text={service.text}
                  />
                </ServiceCard>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:invisible hidden md:visible lg:invisible md:overflow-hidden">
            <h2 className="pl-10 py-5 font-bold">Future Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 place-content-center place-items-center">
              {futureServices.map((service) => (
                <ServiceCard className="w-[14rem] h-[10rem]" key={service.id}>
                  <FutureService className="w-[15rem] h-[15rem] flex flex-col"
                    imageIcon={service.image}
                    text={service.text}
                  />
                </ServiceCard>
              ))}
            </div>
          </div>
    </BodyWrapper>
  );
}
