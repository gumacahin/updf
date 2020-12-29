import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  const { letter, page }  = req.query;
  const { db } = await connectToDatabase();
  const nPerPage = 50;

  if (!letter) {
    return res.status(400).json({});
  }
  const data = await db
    .collection('entries')
    .find({ start: letter })
    .sort( { order: 1 } )
    .skip(page > 0 ? ( ( page - 1 ) * nPerPage ) : 0)
    .limit(nPerPage)
    .toArray();
  res.status(200).json({ data });
}
