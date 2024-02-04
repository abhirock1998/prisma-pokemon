import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Already seeded the dummy Data" });
  // try {
  //   const pokemon = [];
  //   for (let i = 0; i < 20; i++) {
  //     const url = `https://pokeapi.co/api/v2/pokemon/${i + 1}`;
  //     const response = await axios.get(url);
  //     if (response.status === 200) {
  //       const data = response.data;
  //       const pokemonData = {
  //         name: data.name,
  //         types: data.types.map((type: any) => type.type.name),
  //         sprite: data.sprites.front_default,
  //         id: i + 1,
  //       };
  //       pokemon.push(pokemonData);
  //     }
  //   }
  //   await prisma.pokemon.createMany({
  //     data: pokemon,
  //   });
  //   prisma.$disconnect();
  //   return NextResponse.json({
  //     message: "Data seeded successfully",
  //     data: pokemon,
  //   });
  // } catch (e: any) {
  //   console.log(`Error while seeding data: ${e}`);
  //   prisma.$disconnect();
  //   return NextResponse.json(
  //     { error: `Error while seeding data: ${e.message}` },
  //     { status: 500 }
  //   );
  // }
}
