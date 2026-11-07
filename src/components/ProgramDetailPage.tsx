import React from 'react';
import { BookOpen, GraduationCap, Award } from 'lucide-react';
import { Program, FundingOpportunity } from '../types';
import { DetailHeader } from './detail/DetailHeader';
import { AcademicStructureSection } from './detail/AcademicStructureSection';
import { AdmissionCriteriaSection } from './detail/AdmissionCriteriaSection';
import { FundingSection } from './detail/FundingSection';
import { DeadlinesSidebar } from './detail/DeadlinesSidebar';
import { LivingCostsSidebar } from './detail/LivingCostsSidebar';
import { RecordMetaSidebar } from './detail/RecordMetaSidebar';

export interface ProgramDetailPageProps {
  program: Program;
  fundingList: FundingOpportunity[];
  onBack: () => void;
  onEditProgram: (program: Program) => void;
  onDeleteProgram: (id: string) => void;
  onAddFunding: (program: Program) => void;
  onEditFunding: (funding: FundingOpportunity) => void;
  onDeleteFunding: (id: string) => void;
}

export const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({
  program,
  fundingList,
  onBack,
  onEditProgram,
  onDeleteProgram,
  onAddFunding,
  onEditFunding,
  onDeleteFunding,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const tabGroupId = React.useId();

  const tabs = [
    { label: 'Overview', icon: BookOpen, count: null },
    { label: 'Admissions', icon: GraduationCap, count: null },
    { label: 'Funding', icon: Award, count: fundingList.length },
  ];

  React.useEffect(() => setActiveTab(0), [program.id]);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index + tabs.length - 1) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActiveTab(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="program-detail" key={program.id}>
      <DetailHeader
        program={program}
        onBack={onBack}
        onEditProgram={onEditProgram}
        onDeleteProgram={onDeleteProgram}
      />
      <div className="detail-layout">
        <div className="detail-main">
          {/* Editorial Underline Tab Navigation */}
          <nav className="detail-tabs-container" aria-label="Program sections">
            <div className="detail-tabs" role="tablist">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isSelected = activeTab === index;
                return (
                  <button
                    key={tab.label}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={tabGroupId + '-tab-' + index}
                    aria-controls={tabGroupId + '-panel-' + index}
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setActiveTab(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className="detail-tab-btn"
                  >
                    <Icon size={15} className="detail-tab-icon" aria-hidden="true" />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className="detail-tab-badge">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          <div
            role="tabpanel"
            id={tabGroupId + '-panel-0'}
            aria-labelledby={tabGroupId + '-tab-0'}
            hidden={activeTab !== 0}
            tabIndex={0}
          >
            <AcademicStructureSection program={program} />
          </div>

          <div
            role="tabpanel"
            id={tabGroupId + '-panel-1'}
            aria-labelledby={tabGroupId + '-tab-1'}
            hidden={activeTab !== 1}
            tabIndex={0}
          >
            <AdmissionCriteriaSection program={program} />
          </div>

          <div
            role="tabpanel"
            id={tabGroupId + '-panel-2'}
            aria-labelledby={tabGroupId + '-tab-2'}
            hidden={activeTab !== 2}
            tabIndex={0}
          >
            <FundingSection
              program={program}
              fundingList={fundingList}
              onAddFunding={onAddFunding}
              onEditFunding={onEditFunding}
              onDeleteFunding={onDeleteFunding}
            />
          </div>
        </div>

        <aside className="detail-sidebar" aria-label="Dates, costs and record information">
          <DeadlinesSidebar program={program} />
          <LivingCostsSidebar program={program} />
          <RecordMetaSidebar program={program} />
        </aside>
      </div>
    </div>
  );
};
