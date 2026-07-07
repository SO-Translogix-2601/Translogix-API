import { Trans, useTranslation } from "react-i18next";
import { CheckCircle2, Edit3, Loader2, Plus, RefreshCcw, Save, Search, Trash2, X } from "lucide-react";
import { fieldLabel, formatValue } from "../utils/format.js";

export function ResourceView({ activeModule, filteredItems, query, setQuery, loading, loadItems, startCreate, startEdit, requestDelete, confirmDelete, cancelDelete, selected, deleteTarget, modalMode, closeModal, message, form, updateField, saveItem, saving }) {
  const { t } = useTranslation();
  const isFormModal = modalMode === "create" || modalMode === "edit";
  const isDeleteModal = modalMode === "delete";
  const deleteLabel = deleteTarget?.codigo || deleteTarget?.placa || deleteTarget?.razon_social || deleteTarget?.nombre_completo || deleteTarget?.nombre || deleteTarget?.email || t("common.thisRecord");

  return (
    <section className="workspace single">
      <div className="listPanel">
        <div className="panelHeader"><div><h2>{t("common.records")}</h2><span>{t("common.visible", { count: filteredItems.length })}</span></div><div className="actions"><label className="searchBox"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("common.search")} /></label><button className="iconButton" onClick={loadItems} type="button" title={t("common.refresh")}>{loading ? <Loader2 className="spin" size={18} /> : <RefreshCcw size={18} />}</button><button className="primaryButton" onClick={startCreate} type="button"><Plus size={18} />{t("common.new")}</button></div></div>
        {message && <div className={`notice ${message.type}`}>{message.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}<span>{message.text}</span></div>}
        <div className="tableWrap"><table><thead><tr>{activeModule.columns.map((column) => <th key={column}>{t(`modules.${activeModule.key}.fields.${column}`, fieldLabel(activeModule, column))}</th>)}<th className="tableActions">{t("common.actions")}</th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item._id} className={selected?._id === item._id ? "selectedRow" : ""}>{activeModule.columns.map((column) => <td key={column}>{formatValue(item[column])}</td>)}<td className="tableActions"><button className="iconButton" onClick={() => startEdit(item)} type="button" title={t("common.edit")}><Edit3 size={17} /></button><button className="dangerButton" onClick={() => requestDelete(item)} type="button" title={t("common.delete")}><Trash2 size={17} /></button></td></tr>)}{!loading && filteredItems.length === 0 && <tr><td className="emptyState" colSpan={activeModule.columns.length + 1}>{t("common.noRecords")}</td></tr>}</tbody></table></div>
      </div>

      {isFormModal && (
        <div className="modalOverlay" role="dialog" aria-modal="true">
          <form className="modalPanel" onSubmit={saveItem}>
            <div className="modalHeader"><div><p className="eyebrow">{t(`modules.${activeModule.key}.title`, activeModule.title)}</p><h2>{modalMode === "edit" ? t("common.editRecord") : t("common.createRecord")}</h2></div><button className="iconButton" onClick={closeModal} type="button" title={t("common.close")}><X size={18} /></button></div>
            <div className="formGrid">{activeModule.fields.map((field) => <label className={field.type === "json" ? "field wide" : "field"} key={field.name}><span>{t(`modules.${activeModule.key}.fields.${field.name}`, field.label)}</span>{field.type === "json" ? <textarea value={form[field.name] || ""} onChange={(event) => updateField(field.name, event.target.value)} rows={7} /> : field.type === "checkbox" ? <input checked={Boolean(form[field.name])} onChange={(event) => updateField(field.name, event.target.checked)} type="checkbox" /> : <input required={field.required} type={field.type || "text"} value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} />}</label>)}</div>
            <div className="formActions"><button className="secondaryButton" onClick={closeModal} type="button"><X size={18} />{t("common.cancel")}</button><button className="primaryButton" disabled={saving} type="submit">{saving ? <Loader2 className="spin" size={18} /> : <Save size={18} />}{t("common.save")}</button></div>
          </form>
        </div>
      )}

      {isDeleteModal && (
        <div className="modalOverlay" role="dialog" aria-modal="true">
          <section className="modalPanel confirmPanel">
            <div className="modalHeader"><div><p className="eyebrow">{t("common.confirmation")}</p><h2>{t("common.deleteRecordTitle")}</h2></div><button className="iconButton" onClick={cancelDelete} type="button" title={t("common.close")}><X size={18} /></button></div>
            <p><Trans i18nKey="common.deleteRecordBody" values={{ target: deleteLabel }} components={[<strong key="target" />]} /></p>
            <div className="formActions"><button className="secondaryButton" onClick={cancelDelete} type="button">{t("common.cancel")}</button><button className="dangerTextButton" disabled={loading} onClick={confirmDelete} type="button"><Trash2 size={18} />{t("common.delete")}</button></div>
          </section>
        </div>
      )}
    </section>
  );
}
