import React, { useState } from 'react';
import { Wallet, TrendingUp, Target, Calculator, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

export const LandingPage: React.FC = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      
      {/* Header */}
      <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-600 rounded-lg text-white">
                <Wallet size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">BudgetMaster</span>
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Maîtrisez vos finances <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-400">
            simplement et efficacement.
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          BudgetMaster est l'outil ultime pour suivre vos dépenses, planifier votre épargne et simuler vos projets d'avenir. Gratuit, sécurisé et synchronisé.
        </p>
        <div className="flex justify-center gap-4 flex-col sm:flex-row">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-8 py-4 text-lg font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2"
          >
            Commencer gratuitement <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tout ce dont vous avez besoin</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Une suite complète d'outils pour gérer votre argent.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="text-green-500" />}
              title="Suivi des Dépenses"
              description="Catégorisez vos transactions et visualisez où part votre argent grâce à des graphiques interactifs."
            />
            <FeatureCard 
              icon={<Target className="text-primary-500" />}
              title="Prévisionnel Budgétaire"
              description="Fixez des objectifs pour vos dépenses fixes, variables et votre épargne. Suivez vos progrès en temps réel."
            />
            <FeatureCard 
              icon={<Calculator className="text-orange-500" />}
              title="Simulateur de Prêt"
              description="Projetez-vous dans l'avenir en calculant les mensualités et le coût total de vos crédits immobiliers ou conso."
            />
            <FeatureCard 
              icon={<BarChart2 className="text-purple-500" />}
              title="Analyses Détaillées"
              description="Comparez vos habitudes de consommation par semaine, mois ou année pour mieux comprendre votre budget."
            />
             <FeatureCard 
              icon={<ShieldCheck className="text-teal-500" />}
              title="Données Sécurisées"
              description="Vos données sont chiffrées et stockées en sécurité sur le cloud. Accessible depuis n'importe quel appareil."
            />
             <FeatureCard 
              icon={<Wallet className="text-blue-500" />}
              title="Gestion Multi-catégories"
              description="Distinguez vos besoins (Fixe), vos envies (Variable) et votre futur (Épargne) automatiquement."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="p-1.5 bg-primary-600 rounded text-white">
              <Wallet size={18} />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">BudgetMaster</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} BudgetMaster.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm mb-4 text-2xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);