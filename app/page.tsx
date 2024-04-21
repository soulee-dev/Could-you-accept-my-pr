import InputGroup from "@/components/InputGroup";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 w-[350px] md:w-[800px]">
      <InputGroup ownerParam="" repoParam="" />
      <div>
        <h1 className="text-bold">Hello World!</h1>
        <h2>Click to start example repo or Search</h2>
      </div>
    </div>
  );
}
