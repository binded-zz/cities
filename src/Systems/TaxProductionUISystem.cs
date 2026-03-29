using Colossal.UI.Binding;
using Game.UI;

namespace CitiesSkylines2Mod
{
    public partial class TaxProductionUISystem : UISystemBase
    {
        private const string Group = "taxProduction";

        private bool m_IsVisible = false;
        private float m_TaxRate = 0f;

        protected override void OnCreate()
        {
            base.OnCreate();

            AddBinding(new ValueBinding<bool>(Group, "isVisible", m_IsVisible));
            AddBinding(new ValueBinding<float>(Group, "taxRate", m_TaxRate));
            AddBinding(new TriggerBinding(Group, "toggleWindow", ToggleWindow));
            AddBinding(new TriggerBinding<float>(Group, "setTaxRate", SetTaxRate));
        }

        protected override void OnUpdate() { }

        private void ToggleWindow()
        {
            m_IsVisible = !m_IsVisible;
        }

        private void SetTaxRate(float rate)
        {
            if (rate >= 0f && rate <= 100f)
                m_TaxRate = rate;
        }
    }
}
