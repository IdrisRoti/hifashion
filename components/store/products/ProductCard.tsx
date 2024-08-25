"use client";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { TProducts } from "@/types/supabaseTypes";
import NairaSvg from "@/components/NairaSvg";
import Button from "@/components/Button";
import { useCartStore } from "@/store/cart-store";

type PropType = {
  product: TProducts | null;
};

export default function ProductCard({ product }: PropType) {
  const [imgUrl, setImgUrl] = useState(product?.images[0]);
  const [showVariants, setShowVariants] = useState(false);

  const cart = useCartStore((state)=>state.cart)
  const addToCart = useCartStore((state)=>state.addToCart)



  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ type: "tween" }}
      viewport={{ once: true }}
      className=" overflow-hidden border border-slate-300"
    >
      <Link href={`product/${product?.id}`}>
        <div
          onMouseOver={() =>
            setImgUrl(
              product?.images.length! > 1
                ? product?.images[1]
                : product?.images[0]
            )
          }
          onMouseLeave={() => setImgUrl(product?.images[0])}
          className="relative bg-gray-100 h-[14rem] md:h-[20rem]"
        >
          <Image className="object-cover" src={imgUrl as string} alt="" fill />
          <div className="absolute z-10 flex items-center justify-between w-full p-2 md:p-4">
            <span className="uppercase bg-secondary/30 px-3 py-1 text-xs rounded-full text-secondary font-bold">
              New
            </span>
            <span className="text-muted-foreground cursor-pointer">
              <Heart />
            </span>
          </div>
        </div>
      </Link>
      <div className="p-2 md:p-4">
        <h2 className="text-base md:text-lg font-semibold truncate">
          {product?.name}
        </h2>
        {showVariants ? (
          <div className="w-full h-full flex gap-2 items-end justify-between mt-auto">
            <div className="w-full flex flex-wrap gap-2 items-end justify-start">
            {product?.variants.map((variant, i) => {
              const inCart = cart.some((item)=>item.id === product.id && item.variant === variant)

              return (
                <button
                  disabled={inCart}
                  onClick={()=>addToCart(product, variant)}
                  key={i}
                  className="h-8 text-sm font-semibold flex items-center justify-center border-2 rounded-md cursor-pointer px-3 bg-white hover:bg-primary hover:text-white transition-smooth hover:border-transparent disabled:bg-primary disabled:border-transparent disabled:text-white disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {variant}
                </button>
              );
            })}
          </div>
          <button onClick={()=>setShowVariants(false)} className="w-7 aspect-square rounded-full border grid place-items-center hover:opacity-60 transition-smooth"><X className="w-4 h-4"/></button>
          </div>
        ) : (
          <div className="md:flex justify-between items-end">
            <div>
              <span className="text-muted-foreground text-xs">
                {product?.category}
              </span>
              <h2 className="text-xl font-semibold flex gap-1 items-center ">
                <NairaSvg />
                <span>{product?.price?.toFixed(2)}</span>
              </h2>
            </div>
            {product?.variants.length ? (
              <Button 
                onClick={()=>setShowVariants(true)}
                label="Add to cart"
                className="border-gray-400 py-1.5 rounded-none text-gray-900 max-md:mt-2 max-md:text-xs max-md:w-full"
              />
            ) : (
              <Button
                disabled={cart.some((item)=>item.id === product?.id)}
                onClick={()=>addToCart(product as TProducts)}
                label="Add to cart"
                className="border-gray-400 py-1.5 rounded-none text-gray-900 max-md:mt-2 max-md:text-xs max-md:w-full"
              />
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
