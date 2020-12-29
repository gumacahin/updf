import { connectToDatabase } from "../../util/mongodb";
import removeAccents from'remove-accents';

export default async (req, res) => {
  let { query }  = req.query;
  const { db } = await connectToDatabase();

  query = removeAccents(query)
  query = query.replace(/[^A-Za-z0-9]/g, '');

  if (!query) {
    return res.status(400).json({});
  }
  // @TODO: return unique ids
  const data = await db
    .collection('entries')
    .find({ key: { $regex: new RegExp(`^${query}`) } } )
    .sort( { order: 1 } )
    .limit(25)
    .toArray();
  res.status(200).json({ data });
}
