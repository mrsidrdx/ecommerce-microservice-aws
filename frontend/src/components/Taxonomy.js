import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import {
  createTaxonomy,
  updateTaxonomy,
  deleteTaxonomy,
} from "../graphql/mutations";
import { getTaxonomiesByParent, getTaxonomy } from "../graphql/queries";
import { v4 as uuidv4 } from 'uuid';

const client = generateClient();

function Taxonomy() {
  const [taxonomies, setTaxonomies] = useState([]);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    ParentId: "",
    Type: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTaxonomies();
  }, []);

  async function fetchTaxonomies(parentId = 'root') {
    try {
      const result = await client.graphql({
        query: getTaxonomiesByParent,
        variables: { ParentId: parentId },
      });

      if (result.data.getTaxonomiesByParent.__typename === "APIError") {
        setError(result.data.getTaxonomiesByParent.error);
      } else {
        setTaxonomies(result.data.getTaxonomiesByParent.taxonomies);
      }
    } catch (err) {
      console.error("Error fetching taxonomies:", err);
      setError("An error occurred while fetching taxonomies.");
    }
  }

  async function handleCreateTaxonomy(e) {
    e.preventDefault();
    try {
      const result = await client.graphql({
        query: createTaxonomy,
        variables: {TaxonomyId: uuidv4(), ...formData}
      });

      if (result.data.createTaxonomy.__typename === "APIError") {
        setError(result.data.createTaxonomy.error);
      } else {
        setFormData({ Name: "", Description: "", ParentId: "", Type: "" });
        fetchTaxonomies();
      }
    } catch (err) {
      console.error("Error creating taxonomy:", err);
      setError("An error occurred while creating the taxonomy.");
    }
  }

  async function handleUpdateTaxonomy(e) {
    e.preventDefault();
    try {
      const result = await client.graphql({
        query: updateTaxonomy,
        variables: { TaxonomyId: selectedTaxonomy.TaxonomyId, ...formData },
      });

      if (result.data.updateTaxonomy.__typename === "APIError") {
        setError(result.data.updateTaxonomy.error);
      } else {
        setSelectedTaxonomy(null);
        setFormData({ Name: "", Description: "", ParentId: "", Type: "" });
        fetchTaxonomies();
      }
    } catch (err) {
      console.error("Error updating taxonomy:", err);
      setError("An error occurred while updating the taxonomy.");
    }
  }

  async function handleDeleteTaxonomy(TaxonomyId) {
    try {
      const result = await client.graphql({
        query: deleteTaxonomy,
        variables: { TaxonomyId },
      });

      if (result.data.deleteTaxonomy.__typename === "APIError") {
        setError(result.data.deleteTaxonomy.error);
      } else {
        fetchTaxonomies();
      }
    } catch (err) {
      console.error("Error deleting taxonomy:", err);
      setError("An error occurred while deleting the taxonomy.");
    }
  }

  function handleSelectTaxonomy(taxonomy) {
    setSelectedTaxonomy(taxonomy);
    setFormData({
      Name: taxonomy.Name,
      Description: taxonomy.Description || "",
      ParentId: taxonomy.ParentId || "",
      Type: taxonomy.Type,
    });
  }

  return (
    <div>
      <h2>Taxonomy</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={
          selectedTaxonomy ? handleUpdateTaxonomy : handleCreateTaxonomy
        }
      >
        <input
          type="text"
          placeholder="Name"
          value={formData.Name}
          onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.Description}
          onChange={(e) =>
            setFormData({ ...formData, Description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Parent ID (optional)"
          value={formData.ParentId}
          onChange={(e) =>
            setFormData({ ...formData, ParentId: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Type"
          value={formData.Type}
          onChange={(e) => setFormData({ ...formData, Type: e.target.value })}
          required
        />
        <button type="submit">
          {selectedTaxonomy ? "Update" : "Create"} Taxonomy
        </button>
      </form>
      <ul>
        {taxonomies.map((taxonomy) => (
          <li key={taxonomy.TaxonomyId}>
            {taxonomy.Name} - Type: {taxonomy.Type}{" "}
            {taxonomy.ParentId && `(Parent: ${taxonomy.ParentId})`}
            <button onClick={() => handleSelectTaxonomy(taxonomy)}>Edit</button>
            <button onClick={() => handleDeleteTaxonomy(taxonomy.TaxonomyId)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Taxonomy;
