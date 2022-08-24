// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.body.action) {
    case "battle-start":
      let enemy = { name: "goblin", health: 50, speed: 5, strenght: 2 };
  }
  //   switch(req.body.event){

  //   }
}
