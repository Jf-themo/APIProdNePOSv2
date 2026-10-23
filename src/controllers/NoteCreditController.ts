import { Request, response, Response } from "express";
import axios, { AxiosResponse } from "axios";

const url: string = "https://api.factus.com.co/v1";
// const url: string = "https://api-sandbox.factus.com.co/v1";
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDhkOTYyYy1kNzZhLTRiODYtOTViYy1mZDk2OTMxYzk5MzkiLCJqdGkiOiJlYzVlOTQwMTgxOWQ4NjAzYTM4OGY1ZGY2NTJiMjRlOTJmYjk2Zjc0NGVkZjcyMGU2MGVjYjgwNmFlMTc4ZGNjN2Q5MzIxOWE4ZWMyMGNkOCIsImlhdCI6MTc0MzY0NDQzNC43MzM2NzksIm5iZiI6MTc0MzY0NDQzNC43MzM2ODIsImV4cCI6MTc0MzY0ODAzNC43MTg5MzQsInN1YiI6IjUiLCJzY29wZXMiOltdfQ.ATo0H8yTKLkNLrPahC_oYqzNMxu5nxUDqf907UmoJAqAJIn08oSQfvSbbNax8aH_taiBdzOtBLyQhabJ5dJwtAB2TiGYdGR7lr-cn0bUkm7x99lag4wHxyTuGofNH9hdNV_RV7j7iz--WAEulJsYBAA4TobbEWLpCcCQoZTEiXvO1TtBkp2JpIibHoD6n4EqnXcIIEcinYjkGEiAF9ng31WJL4EG30zZMPHRJxTHWru44e6JbDs3XIZ-uRdo2ZLAcfHhaNVl9UwfG9V2LaTZN3b8firowlr-XkPE9aIPh7CaoDu8LNR5jzkpuv409u8MR9WMcGTd5R9Amd6USCefX0wZlDiJqPGVfiVAZtk1onEK-v77hAAx8RHbXgO7c3oP5HtOyCieBa389Dag_zDsxR7Y-NfZghA8Bj6SsuZVAx4rD2R8ijeRyIArCk8q6mFDARLtCzZpE-Wxr2q_GFxv3glHLcv-Zco3ieT7tFZItlfDnR6xTQCeKeZDFLX28lXMVUI7pq2CLt5SxtlBHrgQqZn_iyaVY3BEtffk4UC7I2swZZP89sGk6sRDwmCwhLoR8JHx9m_mk_FzrrdXNo7gPs79eGPFdx8ZU4Q9VtBDPAeoOI4YgJkYTGKlA2_nhL04Tpghb2RJ0SliD_fQbETx2aWHhC5h8bxAGi8Rs3Rgjtk";
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

    console.log({ token: body[0].token, body: body[0], items: body[0]?.items });

    try {
      const response = await axios.post(
        `${url}/credit-notes/validate`,
        {
          numbering_range_id: body[0]?.numbering_range_id,
          correction_concept_code: body[0]?.correction_concept_code,
          customization_id: body[0]?.customization_id,
          bill_id: body[0]?.id_bill,
          reference_code: body[0]?.reference_code,
          observation: body[0]?.observation,
          payment_method_code: body[0]?.payment_method_code,
          items: body[0]?.items,
        },
        {
          headers: {
            Authorization: `Bearer ${body[0]?.token}`,
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
