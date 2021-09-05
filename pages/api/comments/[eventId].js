import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const eventId = req.query.eventId;

  let client;

  try {
    client = await MongoClient.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a4ct4.mongodb.net/events?retryWrites=true&w=majority`
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Connecting to the database failed!" });
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      client.close();
      return res.status(422).json({ message: "Invalid input." });
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    let result;

    try {
      const db = client.db();

      result = await db.collection("comments").insertOne({ ...newComment });
      client.close();
    } catch (error) {
      client.close();
      return res.status(500).json({ message: "Inserting comment failed!" });
    }

    newComment._id = result.insertedId.toString();

    return res
      .status(201)
      .json({ message: "Added comment.", comment: newComment });
  }

  if (req.method === "GET") {
    let documents;

    try {
      const db = client.db();

      documents = await db
        .collection("comments")
        .find({ eventId: eventId })
        .sort({ _id: -1 })
        .toArray();

      client.close();
    } catch (error) {
      client.close();
      return res.status(500).json({ message: "Getting comments failed." });
    }
    res.status(200).json({ comments: documents });
  }
}
