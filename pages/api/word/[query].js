import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { query } = req.query;
  const { db } = await connectToDatabase();

  if (!query) {
    return res.status(400).json({});
  }

  let data = await db
    .collection('entries')
    .find({ id: query })
    .sort( { order: 1 } )
    .toArray();
  res.status(200).json({ data });
}
