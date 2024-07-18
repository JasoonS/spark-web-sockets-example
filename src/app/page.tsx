"use client";

import Image from "next/image";
import { useSubscription, gql } from '@apollo/client';
import { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './lib/apolloClient';
import type { AppProps } from 'next/app';

const TRADE_ORDER_EVENT_SUBSCRIPTION = gql`
  subscription TradeOrderEventSubscription {
    TradeOrderEvent(limit: 50, order_by: { timestamp: desc }) {
      id
      trade_price
      trade_size
      timestamp
    }
  }
`;

// // Using Streaming:
// const TRADE_ORDER_EVENT_SUBSCRIPTION = gql`
//   subscription TradeOrderEventStream {
//     TradeOrderEvent_stream(
//       batch_size: 50,
//       cursor: { initial_value: { timestamp: "2024-07-04T11:38:22.000Z" }, ordering: DESC }
//     ) {
//       id
//       trade_price
//       trade_size
//       timestamp
//     }
//   }
// `;

const ORDER_QUERY = gql`
  subscription OrderQuery {
    Order(
      limit: 200,
      where: {
        order_type: { _eq: "Sell" },
        status: { _eq: "Active" },
        asset: { _eq: "0xccceae45a7c23dcd4024f4083e959a0686a191694e76fa4fb76c449361ca01f7" }
      },
      order_by: { price: asc }
    ) {
      id
      asset
      asset_type
      amount
      initial_amount
      order_type
      price
      status
      user
      timestamp
    }
  }
`;

const OrderList: React.FC = () => {
  const { data, loading, error } = useSubscription(ORDER_QUERY);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Active Sell Orders</h1>
      <ul>
        {data.Order.map((order: any) => (
          <li key={order.id}>
            <p>ID: {order.id}</p>
            <p>Asset: {order.asset}</p>
            <p>Asset Type: {order.asset_type}</p>
            <p>Amount: {order.amount}</p>
            <p>Initial Amount: {order.initial_amount}</p>
            <p>Order Type: {order.order_type}</p>
            <p>Price: {order.price}</p>
            <p>Status: {order.status}</p>
            <p>User: {order.user}</p>
            <p>Timestamp: {order.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { data, loading, error } = useSubscription(TRADE_ORDER_EVENT_SUBSCRIPTION);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Trade Order Events</h1>
      <ul>
        {data.TradeOrderEvent.map((event: any) => (
          <li key={event.id}>
            <p>ID: {event.id}</p>
            <p>Price: {event.trade_price}</p>
            <p>Size: {event.trade_size}</p>
            <p>Timestamp: {event.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ApolloProvider client={client}>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      {/* <HomePage /> */}
      <OrderList />

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;OrderList
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
      </ApolloProvider>
    </main>
  );
}
