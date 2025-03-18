import { Request, response, Response } from "express";
import axios, { AxiosResponse } from "axios";

// const url: string = "https://api.factus.com.co/v1";
const url: string = "https://api-sandbox.factus.com.co/v1";
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDhkOTYyYy1kNzZhLTRiODYtOTViYy1mZDk2OTMxYzk5MzkiLCJqdGkiOiIwNTlkZmM1NWI4MzQ3OTg3OWE2YzE0ODM1ZDEwNWZmOTQ4OTEzY2I2MjBjZjk3NzNhMmIwNWMzMWRiNWYyNTQzMTM4NTk0ZGZmNjA3MWJmOSIsImlhdCI6MTc0MTk5NjM0OS4yODE4NjEsIm5iZiI6MTc0MTk5NjM0OS4yODE4NjMsImV4cCI6MTc0MTk5OTk0OS4yNzEwNjcsInN1YiI6IjUiLCJzY29wZXMiOltdfQ.aWwOeCYb-HLiK6nh4Q-fBsn9XyDJntyCfC0K93d27XNGeL2u0GkyuwXcHuAX-nVhweiWNvJt1weatts-ueLe_ieSlai3FxcxfhTWtQmNoK0KygeYx9njM2syLNggyvzP98EEhlOdZQU5dGYLThzconMEuUjFsC-1oxbcxET5Gk8XdtyA0BjeYiXxWj09M7T2uhO6bqPSgTftk3wgjj8Qm7XMh_1-NlX1A1tLnSBoRFWudDJJRXQH9-U0mPK6FsV40VWoa75WgwtJX9vb19oCu2ALBmdcn8agkq8QVsfIjdqE9W7gPaS5k625o96HHos3UvBY_tFwj2kZjnSIAalIbdWfBJE4C9_On5On3OUvla9u0Ao8j46UHePQAQ82YsbSDB8NLdrNCeNcrVwEk7QmIWHXBZ-sPPfz1-8BUAQVF3-SI_6KvgeqrHoFUd6ehQzdoWJhWmfhOIFGevzGWe6zTQinaqzeQ1ijX4A2WyWlrHdpQwRtrVM5E9a-OdwM4CHc5HJq-6mxRSrFIO6qsTw8UDnF5xyqVBH49YzA-CTtaAqdTinmyvT7vAX8Q3gY7IuHx88D9qqUmb1rdWnTKey-v9OMc8iOVzDmfud0P_0ewExMDA_nepIL7mlf9wUx7Mq4CMzAHchq4CA4tkEFyEPK30y9hwsLuYRTfV9Re8_uJCs";
class NoteCreditController {
  // public static async createNoteCredit(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   console.log("ENTRE A NOTA CREDITO");
  //   const body = req.body;

  //   const response = await axios.post(
  //     `${url}/credit-notes/validate`,
  //     {
  //       numbering_range_id: body.numbering_range_id,
  //       correction_concept_code: body.correction_concept_code,
  //       customization_id: body.customization_id,
  //       bill_id: body.bill_id,
  //       reference_code: body.reference_code,
  //       observation: body.observation,
  //       payment_method_code: body.payment_method_code,
  //       items: body.items,
  //     },

  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // }

  // public static async createNoteCredit(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   console.log("ENTRÉ A NOTA CRÉDITO");
  //   const body = req.body;

  //   try {
  //     const response = await axios.post(
  //       `${url}/credit-notes/validate`,
  //       {
  //         numbering_range_id: body.numbering_range_id,
  //         correction_concept_code: body.correction_concept_code,
  //         customization_id: body.customization_id,
  //         bill_id: body.bill_id,
  //         reference_code: body.reference_code,
  //         observation: body.observation,
  //         payment_method_code: body.payment_method_code,
  //         items: body.items,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     // Mostrar en consola el estado de la respuesta
  //     console.log(`STATUS DE RESPUESTA: ${response.status}`);

  //     res.status(response.status).json({ response: response.data });
  //   } catch (error: any) {
  //     if (error?.response?.status === 422) {
  //       console.log(error?.response?.data?.data);
  //       res.status(422).json({ response: error?.response?.data?.data });
  //     } else if (error?.response?.status === 409) {
  //       console.log(error);
  //       res.status(409).json({ response: error });
  //     } else if (error?.response?.status === 500) {
  //       console.log(error?.response?.data?.data);
  //       res.status(500).json({ response: error?.response?.data?.data });
  //     } else {
  //       console.log(error?.response?.data?.data);
  //       res.status(409).json({ response: error?.response?.data?.data });
  //     }
  //   }
  // }
  public static async createNoteCredit(
    req: Request,
    res: Response
  ): Promise<void> {
    console.log("ENTRÉ A NOTA CRÉDITO");
    const body = req.body;

    try {
      const response = await axios.post(
        `${url}/credit-notes/validate`,
        {
          numbering_range_id: body.numbering_range_id,
          correction_concept_code: body.correction_concept_code,
          customization_id: body.customization_id,
          bill_id: body.bill_id,
          reference_code: body.reference_code,
          observation: body.observation,
          payment_method_code: body.payment_method_code,
          items: body.items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Mostrar en consola el estado de la respuesta
      console.log(`STATUS DE RESPUESTA: ${response.status}`);
      console.log(
        "RESPUESTA COMPLETA:",
        JSON.stringify(response.data, null, 2)
      );

      res.status(response.status).json({ response: response.data });
    } catch (error: any) {
      const status = error?.response?.status || 500;
      const errorData = error?.response?.data || {
        message: "Error desconocido",
      };

      console.error(`ERROR ${status}:`, JSON.stringify(errorData, null, 2));

      res.status(status).json({ response: errorData });
    }
  }
}

export default NoteCreditController;
