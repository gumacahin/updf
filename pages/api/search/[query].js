import { connectToDatabase } from "../../../util/mongodb";
import removeAccents from 'remove-accents';

export default async (req, res) => {
  let { query } = req.query;
  const { db } = await connectToDatabase();

  if (!query) {
    return res.status(400).json({});
  }

  query = removeAccents(query)
  query = query.replace(/[^A-Za-z0-9]/g, '');
  let data = await db
    .collection('entries')
    .find({ key: query })
    .sort( { order: 1 } )
    .toArray();

  res.status(200).json({ data });
}
