import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Comment puis-je réserver un hébergement ?",
    answer: "Vous pouvez rechercher des hébergements en utilisant notre barre de recherche sur la page d'accueil. Entrez votre destination, vos dates de séjour et le nombre de voyageurs, puis parcourez les résultats et cliquez sur 'Réserver' pour finaliser votre réservation.",
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer: "Oui, la plupart de nos réservations peuvent être annulées gratuitement jusqu'à 24 heures avant la date d'arrivée. Les conditions d'annulation spécifiques sont indiquées lors de la réservation.",
  },
  {
    question: "Comment puis-je modifier ma réservation ?",
    answer: "Vous pouvez modifier votre réservation depuis votre tableau de bord. Connectez-vous à votre compte, allez dans la section 'Réservations' et cliquez sur 'Modifier' à côté de la réservation concernée.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), PayPal et les virements bancaires pour certaines réservations.",
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, tous les frais sont clairement indiqués lors de la réservation. Le prix affiché inclut les taxes et frais de service, sauf indication contraire.",
  },
  {
    question: "Comment puis-je contacter le support ?",
    answer: "Vous pouvez nous contacter par email à support@nomade.com, par téléphone au +33 1 23 45 67 89, ou via le formulaire de contact sur notre site. Notre équipe est disponible du lundi au vendredi de 9h à 18h.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Questions fréquentes</h1>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-12">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Vous ne trouvez pas votre réponse ?</h3>
                <p className="text-gray-700 mb-4">
                  Notre équipe de support est là pour vous aider
                </p>
                <a href="/contact">
                  <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Nous contacter
                  </button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

