"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "@/components/Button";
import CardPaymentForm from "@/components/forms/CardPaymentForm";
import { useCartStore } from "@/store/cart-store";
import NairaSvg from "@/components/NairaSvg";
import { useCheckoutStore } from "@/store/checkout-details-store";
import toast from "react-hot-toast";
import { generateOrderId } from "@/lib/genOrderId";
import { createOrder } from "@/actions/orderActions";

type PropsType = {
  setOpenPopUp: Dispatch<SetStateAction<boolean>>;
  setOrderId: Dispatch<SetStateAction<string>>;
};

export type TPaymentType = "Cash on Delivery" | "Stripe";

export const PaymentTypesArr = ["Cash on Delivery", "Stripe"] as const;

export default function CheckoutOrderSummary({
  setOpenPopUp,
  setOrderId,
}: PropsType) {
  const variants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cart = useCartStore((state) => state.cart);
  const cartTotal = cart.reduce((acc, currVal) => {
    return acc + currVal.qty * currVal.price!;
  }, 0);

  const setPaymentType = useCheckoutStore((state) => state.setPaymentType);
  const paymentType = useCheckoutStore((state) => state.paymentType);
  const isLoading = useCheckoutStore((state) => state.isLoading);
  const setIsLoading = useCheckoutStore((state) => state.setIsLoading);

  const checkoutState = useCheckoutStore((state) => ({
    firstname: state.firstname,
    lastname: state.lastname,
    address: state.address,
    city: state.city,
    email: state.email,
    zipcode: state.zipcode,
    phone: state.phone,
    paymentType: state.paymentType,
  }));

  const handleOrderProcessing = () => {
    if (
      !checkoutState.firstname ||
      !checkoutState.lastname ||
      !checkoutState.address ||
      !checkoutState.city ||
      !checkoutState.email ||
      !checkoutState.paymentType ||
      !checkoutState.phone
    ) {
      toast.error("Please fill the delivery information.");
      return;
    }
    if (!cart.length) {
      toast.error("Your cart is empty.");
      return;
    }
    setIsLoading(true);

    const orderId = generateOrderId();
    const orderData = {
      ...checkoutState,
      checkoutItems: cart,
      orderId,
    };
    createOrder(orderData)
      .then((res) => {
        if (res?.success) {
          console.log("Success");
          setIsLoading(false);
        }
        setOrderId(orderId);
        setOpenPopUp(true);
      })
      .catch((err) => {
        console.log(" Order Processing Error", err);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <motion.section
      variants={variants}
      initial="initial"
      animate="animate"
      className="border shadow rounded-md p-3 md:p-4 md:col-span-4"
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-5">
        Order Summary
      </h2>
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-5">
          Payment Details
        </h2>
        <div className="">
          {PaymentTypesArr.map((type) => (
            <div key={type} className="mb-3">
              <input
                type="radio"
                onChange={() => setPaymentType(type)}
                checked={type === paymentType}
                className="mr-2"
              />
              {type}
            </div>
          ))}
        </div>
      </div>
      {paymentType === "Stripe" && (
        // <CardPaymentForm />
        <div>Coming soon...</div>
      )}
      <div className="mt-6 md:mt-8">
        <div className="flex items-center justify-between mb-3 opacity-70">
          <p className="font-semibold">Sub Total</p>
          <p className="font-semibold text-sm flex items-center gap-1">
            ${cartTotal.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between mb-3 opacity-70">
          <p className="font-semibold">Coupon Discount</p>
          <p className="font-semibold text-sm flex items-center gap-1">
           $0.00
          </p>
        </div>
        <div className="flex items-center justify-between mb-3 opacity-70">
          <p className="font-semibold">Shipping Cost</p>
          <p className="font-semibold text-sm flex items-center gap-1">
            
            $0.00
          </p>
        </div>
      </div>
      <div className="mt-6 md:mt-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">Total</p>
          <p className="font-semibold text-sm flex items-center gap-1">
            
            ${cartTotal.toFixed(2)}
          </p>
        </div>
        <Button
          loading={isLoading}
          onClick={handleOrderProcessing}
          label="Proceed"
          solid
          className="w-full"
        />
      </div>
    </motion.section>
  );
}
