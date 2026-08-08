const {
  getAllStagiares,
  getStagiareByDomain,
  createStagiare,
  deleteStagiare,
} = require("../services/stagiareService");

const getAllStagiareController = async (req, res) => {
  try {
    const stagaires = await getAllStagiares(req.company._id);
    if (stagaires.length === 0) {
      return res.status(404).json({
        msg: "no stagiares",
      });
    }
    res.status(200).json({
      msg: "all stagiares",
      stagiaires: stagaires,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getStagaireByDomainController = async (req, res) => {
  try {
    const { domaine } = req.params;
    const stagiare = await getStagiareByDomain(domaine, req.company._id);
    if (stagiare.length === 0 || !stagiare) {
      return res.status(400).send("no user has this speciality");
    }
    res.status(200).json({
      data: stagiare,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// const getStagiareByNameController = async (req, res) => {
//   try {
//     const { nom } = req.params;
//     const stagiare = await getStagiareByName(nom, req.company._id);
//     if (!stagiare || stagiare.length === 0) {
//       return res.status(404).send("user not found");
//     }
//     res.status(200).json({
//       data: stagiare,
//     });
//   } catch (e) {
//     res.status(500).send(e);
//   }
// };

const createStagiareController = async (req, res) => {
  try {
    const { nom, prenom, telephone, domaine, niveaux, dateDebut, dateFin } =
      req.body;
    if (
      !nom ||
      !prenom ||
      !telephone ||
      !domaine ||
      !niveaux ||
      !dateDebut ||
      !dateFin
    ) {
      return res.status(400).send("all field are required");
    }
    const newStagiare = await createStagiare({
      nom,
      prenom,
      telephone,
      domaine,
      niveaux,
      dateDebut,
      dateFin,
      company: req.company._id,
    });
    res.status(201).json({
      msg: "user is created successfuly",
      data: newStagiare,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteStagiareController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteStagiare(id, req.company._id);
    if (!deleted) {
      return res.status(404).send("user not found");
    }
    res.status(200).json({
      msg: "the user is deleted seccessufly",
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = {
  getAllStagiareController,
  getStagaireByDomainController,
  createStagiareController,
  deleteStagiareController,
};
