// src/components/ComponentesPage.jsx

import BibliotecaTab from "./componentes/BibliotecaTab";
import LicoesTab from "./componentes/LicoesTab";

export default function ComponentesPage({ activeTab }) {
  return (
    <>
      {activeTab === "biblioteca" && <BibliotecaTab />}
      {activeTab === "licoes" && <LicoesTab />}
    </>
  );
}
