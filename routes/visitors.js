const express = require("express");
const { Visit } = require("../models/visit");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const Visitors = await Visit.find();

  if (!Visitors) {
    res.status(500).json({ success: false });
  }
  res.send(Visitors);
});

router.get("/day", async (req, res) => {
  try {
    const today = new Date().toLocaleDateString(); // Lấy ngày hôm nay
    let visitor = await Visit.findOne({ name: "Total Visitors", date: today });

    if (visitor) {
      visitor.count++;
      await visitor.save();
      res.json({ count: visitor.count }); // Trả về phản hồi trong định dạng JSON
    } else {
      const newVisitor = new Visit({
        name: "Total Visitors",
        count: 1,
        date: today,
      });
      await newVisitor.save();
      res.json({ count: 1 }); // Trả về phản hồi trong định dạng JSON
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// sự khác biệt giữa cá phương thức trả về của get trên và get dưới res.json và res.send

// router.get("/day", async (req, res) => {
//   try {
//     const today = new Date().toLocaleDateString(); // Lấy ngày hôm nay
//     let visitor = await Visit.findOne({ name: "Total Visitors", date: today });

//     if (visitor) {
//       visitor.count++;
//       await visitor.save();
//       res.send(`Số lượt truy cập ngày ${today}: ${visitor.count}`);
//     } else {
//       const newVisitor = new Visit({
//         name: "Total Visitors",
//         count: 1,
//         date: today,
//       });
//       await newVisitor.save();
//       res.send(`Số lượt truy cập ngày ${today}: 1`);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Lỗi server" });
//   }
// });

router.get("/month", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Tháng hiện tại
    const currentYear = currentDate.getFullYear(); // Năm hiện tại

    // Lấy ngày đầu tháng và ngày cuối tháng
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

    const result = await Visit.aggregate([
      {
        $match: {
          name: "Total Visitors",
          date: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalVisitors: { $sum: "$count" },
        },
      },
    ]);

    let visitorCount;
    if (result.length > 0) {
      visitorCount = result[0].totalVisitors;
    } else {
      visitorCount = 0;
    }

    res.json({ count: visitorCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
