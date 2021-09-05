import { MongoClient } from "mongodb";

async function connectDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a4ct4.mongodb.net/events?retryWrites=true&w=majority`
  );

  return client;
}

async function insertDocument(client, document) {
  const db = client.db();

  await db.collection("newsletter").insertOne(document);
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email: userEmail } = req.body;

    if (!userEmail || !userEmail.includes("@")) {
      return res.status(422).json({ message: "Invalid email address." });
    }

    let client;

    try {
      client = await connectDatabase();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Connecting to the database failed!" });
    }

    try {
      await insertDocument(client, { email: userEmail });
      client.close();
    } catch (error) {
      client.close();
      return res.status(500).json({ message: "Inserting data failed!" });
    }

    res.status(201).json({ message: "Signed up!" });
  }
}
