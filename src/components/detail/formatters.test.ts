import { describe, it, expect } from 'vitest';
import {
  getDegreeRouteLabel,
  formatProgramStructure,
  formatFundingCoverage,
  formatMonthlyStipend,
} from './formatters';
import { Program, FundingOpportunity } from '../../types';

describe('formatters utility', () => {
  describe('getDegreeRouteLabel', () => {
    it('returns proper labels for each degree route', () => {
      const baseProg = {
        degreeRoute: 'Masters',
      } as Program;

      expect(getDegreeRouteLabel(baseProg)).toBe('Master’s Degree');

      expect(
        getDegreeRouteLabel({ ...baseProg, degreeRoute: 'DirectPhD' })
      ).toBe('Direct PhD from Bachelor’s');

      expect(
        getDegreeRouteLabel({
          ...baseProg,
          degreeRoute: 'MastersRequiredPhD',
        })
      ).toBe('PhD (Requires Completed Master’s)');

      expect(
        getDegreeRouteLabel({
          ...baseProg,
          degreeRoute: 'IntegratedMastersPhD',
        })
      ).toBe('Integrated Master’s–PhD');

      expect(
        getDegreeRouteLabel({
          ...baseProg,
          degreeRoute: 'Unclear',
          directPhDEntry: 'Unclear',
        })
      ).toBe('PhD (Entry Route Unverified)');
    });
  });

  describe('formatProgramStructure', () => {
    it('maps known structure keys to clean labels', () => {
      expect(formatProgramStructure('CourseworkPlusThesis')).toBe(
        'Coursework + Master’s Thesis'
      );
      expect(formatProgramStructure('PhDCourseworkDissertation')).toBe(
        'Doctoral Coursework + Dissertation'
      );
      expect(formatProgramStructure('TaughtCourseworkOnly')).toBe(
        'Taught Coursework (No Thesis)'
      );
    });
  });

  describe('formatFundingCoverage', () => {
    it('maps coverage keys to human-readable strings', () => {
      expect(formatFundingCoverage('FullRide')).toBe(
        'Full Ride (Tuition + Living)'
      );
      expect(formatFundingCoverage('FullTuitionPartialLiving')).toBe(
        'Full Tuition + Partial Living'
      );
      expect(formatFundingCoverage('FullTuitionOnly')).toBe(
        'Full Tuition Waiver'
      );
    });
  });

  describe('formatMonthlyStipend', () => {
    it('formats stipend with amount and currency', () => {
      const fund = {
        monthlyStipend: {
          amount: 2500,
          currency: 'USD',
          grossOrNet: 'Net',
        },
      } as FundingOpportunity;

      expect(formatMonthlyStipend(fund)).toBe('2,500 USD/mo Net');
    });

    it('handles confirmed zero stipend', () => {
      const fund = {
        monthlyStipend: {
          isZeroConfirmed: true,
        },
      } as FundingOpportunity;

      expect(formatMonthlyStipend(fund)).toBe('Confirmed Zero Stipend');
    });

    it('handles unpublished stipend', () => {
      const fund = {
        monthlyStipend: {
          isUnpublished: true,
        },
      } as FundingOpportunity;

      expect(formatMonthlyStipend(fund)).toBe('Stipend Unpublished');
    });
  });
});

