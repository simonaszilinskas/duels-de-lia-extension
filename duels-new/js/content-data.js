// Content data for Duels de l'IA

const CONTENT_DATA = {
  impact: {
    title: "💡 Impact environnemental",
    blocks: {
      prompt: {
        title: "Prompts éco-responsables",
        content: `
          <h3>Comment formuler des prompts éco-responsables ?</h3>
          <ul>
            <li>Soyez précis dès le début pour éviter les itérations inutiles</li>
            <li>Évitez les requêtes en chaîne quand une seule suffit</li>
            <li>Préférez les modèles adaptés à votre besoin (pas toujours le plus gros)</li>
            <li>Réutilisez les réponses existantes quand c'est possible</li>
          </ul>
          <p><strong>Exemple concret :</strong></p>
          <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin: 12px 0;">
            Au lieu de : "Qu'est-ce que le réchauffement climatique ?"<br>
            Préférez : "Explique en 3 points les principales causes du réchauffement climatique"
          </div>
        `
      },
      debate: {
        title: "Cartes débat",
        content: `
          <h3>Questions pour animer le débat</h3>
          <div style="display: grid; gap: 12px;">
            <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <strong>🤔 Question 1:</strong><br>
              L'IA peut-elle être une solution au changement climatique ou fait-elle partie du problème ?
            </div>
            <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <strong>🤔 Question 2:</strong><br>
              Comment mesurer l'impact environnemental réel de nos usages de l'IA ?
            </div>
            <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <strong>🤔 Question 3:</strong><br>
              Quels critères utiliser pour choisir un modèle d'IA plus responsable ?
            </div>
          </div>
        `
      },
      resources: {
        title: "Ressources pédagogiques",
        content: `
          <h3>Pour approfondir</h3>
          <ul style="line-height: 1.8;">
            <li>📊 <a href="https://www.nature.com/articles/s41558-022-01377-7" target="_blank">Étude sur l'empreinte carbone de l'IA</a></li>
            <li>📈 <a href="https://arxiv.org/abs/1906.02243" target="_blank">Energy and Policy Considerations for Deep Learning in NLP</a></li>
            <li>🎮 <a href="https://huggingface.co/spaces/huggingface/carbon-footprint" target="_blank">Calculateur d'empreinte carbone Hugging Face</a></li>
            <li>📚 <a href="https://www.thegreenwebfoundation.org/" target="_blank">The Green Web Foundation</a></li>
          </ul>
          <p style="margin-top: 16px;"><strong>Chiffres clés :</strong></p>
          <div style="background: #fef3c7; padding: 12px; border-radius: 8px;">
            • L'entraînement de GPT-3 = ~550 tonnes de CO2<br>
            • Une requête ChatGPT = ~4,32g de CO2<br>
            • Data centers = 1% de la consommation électrique mondiale
          </div>
        `
      },
      faq: {
        title: "FAQ",
        content: `
          <h3>Questions fréquentes</h3>
          <div style="display: grid; gap: 16px;">
            <div>
              <h4 style="color: #2563eb;">Q: L'IA consomme-t-elle vraiment beaucoup d'énergie ?</h4>
              <p>R: Oui, particulièrement pendant l'entraînement. Par exemple, l'entraînement de GPT-3 a nécessité autant d'énergie que 120 foyers américains pendant un an.</p>
            </div>
            <div>
              <h4 style="color: #2563eb;">Q: Peut-on utiliser l'IA de manière éco-responsable ?</h4>
              <p>R: Absolument ! En choisissant des modèles adaptés, en optimisant nos prompts, et en privilégiant des services alimentés en énergie renouvelable.</p>
            </div>
            <div>
              <h4 style="color: #2563eb;">Q: Comment réduire mon impact ?</h4>
              <p>R: Évitez les requêtes inutiles, réutilisez les réponses, préférez des modèles plus petits quand c'est suffisant, et sensibilisez votre entourage.</p>
            </div>
          </div>
        `
      }
    },
    ultimateQuestion: {
      question: "Comment concilier innovation technologique et responsabilité environnementale dans l'usage de l'IA ?",
      link: "https://comparia.beta.gouv.fr/conclusion-impact",
      linkText: "Découvrir la conclusion →"
    }
  },
  bias: {
    title: "Biais",
    blocks: {},
    ultimateQuestion: {
      question: "Comment garantir une IA équitable et non discriminante ?",
      link: "https://comparia.beta.gouv.fr/conclusion-biais",
      linkText: "Découvrir la conclusion →"
    }
  },
  sovereignty: {
    title: "Souveraineté numérique",
    blocks: {},
    ultimateQuestion: {
      question: "Comment préserver notre autonomie numérique face aux géants de l'IA ?",
      link: "https://comparia.beta.gouv.fr/conclusion-souverainete",
      linkText: "Découvrir la conclusion →"
    }
  }
};