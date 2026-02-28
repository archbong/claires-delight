"use client";

import { useState } from "react";
import Banner from "@/app/components/banner/Banner";
import Button from "@/app/components/button/Button";
import { Report } from "notiflix";
import ContactCard from "@/app/components/contact/ContactCard";
import { contactInfo } from "@/app/components/contact/contactInfo";
import { contactBanner } from "@/public/image/cdn/cdn";
import Navbar from "@/app/components/header/navbar/Navbar";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import { addContact } from "@/lib/action";
import SearchProductResults from "@/app/components/Spice/SearchProductResult";
import { useProductsStore } from "@/app/store";

export default function Page() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const products = useProductsStore((state) => state.products)
  const searchTerm = useProductsStore((state) => state.searchTerm)
  const setSearchTerm = useProductsStore((state) => state.setSearchTerm)
  const searchResults = useProductsStore((state) => state.filteredProducts);


  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("firstname", formData.firstname);
    formDataToSend.append("lastname", formData.lastname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("message", formData.message);

    try {
      await addContact(formDataToSend);
      Report.success(
        "Contact Message",
        "Your message was successfully sent!",
        "close",
      );
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        contact: "",
        message: "",
      });
    } catch (error) {
      console.error("Error adding contact:", error);
      Report.failure(
        "Contact Message",
        `An Error Occurred: ${error}`,
        "exit",
        () => {
          Report.info(
            "Bug Report",
            "An Bug report was sent, our engineers will fix this error. Please try again.",
            "close",
          );
        },
      );
    }
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      {searchTerm ? (
        <SearchProductResults results={searchResults} />
      ) : (
        <div className="relative">
          <Banner
            image={contactBanner}
            title={`Contact Us`}
            subtitle={`Have a question or feedback?
            Reach out to us! We're here to help,
            and eager to hear from you. Please fill the form below.`}
          />
          <div className="card shadow-2xl w-[60rem] h-[40rem] rounded-xl mx-auto absolute left-1/2 transform -translate-x-1/2 -translate-y-20 bg-white z-10">
            <div className="p-20">
              <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-10 pb-10">
                {contactInfo.map((contact) => (
                  <ContactCard key={contact.id} icon={contact.icon}>
                    {contact.info}
                  </ContactCard>
                ))}
              </div>
              <form className="form-control" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-3 w-full">
                  <input
                    className="border-teritaryGrey focus:border-teritaryGrey rounded-md py-3"
                    id="firstname"
                    name="firstname"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={(e) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                  />
                  <input
                    className="border-teritaryGrey focus:border-teritaryGrey rounded-md py-3"
                    id="lastname"
                    name="lastname"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-3 w-full">
                  <input
                    className="border-teritaryGrey focus:border-teritaryGrey rounded-md py-3"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <input
                    className="border-teritaryGrey focus:border-teritaryGrey rounded-md py-3"
                    id="contact"
                    name="contact"
                    type="text"
                    placeholder="Phone Number"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                  />
                </div>
                <textarea
                  className="textarea border-teritaryGrey focus:border-teritaryGrey w-full h-40"
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
                <div className="flex justify-center items-center py-10">
                  <button
                    type="submit"
                    className="btn w-[150px] h-[50px] bg-orange hover:bg-green text-white"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="relative top-[40rem]">
        <ResponsiveFooter />
      </div>
    </>
  );
}
