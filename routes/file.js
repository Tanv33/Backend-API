import express from "express";
import { Dropbox } from "dropbox";
import files from "../models/fileschema.js";
import { upload } from "../multer.js";
import axios from "axios";
import { readFile } from "fs/promises";
import { unlink } from "fs/promises";

const routes = express.Router();
const dbx = new Dropbox({
  accessToken:
    "sl.BAQPWsdJWGkQVYMTFBvHBNVwrUQ_m6NKPMIBrGEjNNursxuJ3ylSvaalUkv6Rm13zHL8naNKETJlDNXE88D2qLAEROEBtRJs8BFfbEw9vfLWyHe6z_96xmcK1_SFZ7SI9qH2PAUGfXz9",
  // fetch,
});

routes.post("/savefile", upload.any(), async (req, res) => {
  try {
    const { userId } = req.body;
    const response = await axios({
      method: `POST`,
      url: `https://content.dropboxapi.com/2/files/upload`,
      headers: {
        Authorization: `Bearer sl.BAQPWsdJWGkQVYMTFBvHBNVwrUQ_m6NKPMIBrGEjNNursxuJ3ylSvaalUkv6Rm13zHL8naNKETJlDNXE88D2qLAEROEBtRJs8BFfbEw9vfLWyHe6z_96xmcK1_SFZ7SI9qH2PAUGfXz9`,
        "Content-Type": "application/octet-stream",
        "Dropbox-API-Arg": `{"path":"/${req.files[0].filename}"}`, //file path of dropbox
      },
      data: await readFile(req.files[0].path), //local path to uploading file
    });
    if (response) {
      console.log(response);
      dbx
        .sharingCreateSharedLinkWithSettings({
          path: response.data.path_display,
          settings: {
            requested_visibility: "public",
            audience: "public",
            access: "viewer",
          },
        })
        .then(async (e) => {
          console.log(e.result.url);

          // saving URL to mongodb database
          const savingUrl = await new files({
            userId: userId,
            fileUrl: e.result.url,
          });
          savingUrl
            .save()
            .then(async (data) => {
              console.log(data);
              res.send("Url save successfully");
              await unlink(req.files[0].path);
            })
            .catch((error) => {
              console.log(error.message);
              res.send("Some Error Occured");
            });
        })
        .catch((err) => {
          console.log(err);
          res.send("error");
        });
    } else {
      res.status(400).send("Error in server");
    }
  } catch (err) {
    console.log(`X ${err.message}`);
    res.status(400).send("Error in server");
  }
});

export default routes;
