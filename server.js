require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const PORT = process.env.PORT || 3000;

if (!APP_ID || !APP_CERTIFICATE) {
  console.error("❌ يجب تعديل .env و وضع APP_ID و APP_CERTIFICATE");
  process.exit(1);
}

app.get("/token", (req, res) => {
  const channelName = req.query.channel;
  if (!channelName) {
    return res.status(400).json({ error: "يجب إدخال اسم القناة كقيمة query ?channel=اسم_القناة" });
  }

  const uid = 0; // أو ضع رقم المستخدم إذا احتجت
  const role = RtcRole.PUBLISHER;
  const expireTimeInSeconds = 3600; // صلاحية التوكن بالثواني (مثلاً ساعة)

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTimestamp + expireTimeInSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpireTime
    );
    return res.json({ token });
  } catch (err) {
    console.error("خطأ أثناء بناء التوكن:", err);
    return res.status(500).json({ error: "خطأ في توليد التوكن" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});