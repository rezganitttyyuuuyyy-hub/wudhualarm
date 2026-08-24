import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const REWARDED_AD_UNIT_ID = Platform.select({
  android: 'ca-app-pub-6771546681551540/1111682904',
  ios: 'ca-app-pub-6771546681551540/1111682904',
  default: TestIds.REWARDED,
});

export type AdResult = 'rewarded' | 'dismissed' | 'not_ready' | 'error';

export interface RewardedAdCallback {
  onReward?: () => void;
  onDismiss?: () => void;
  onError?: (msg: string) => void;
}

let rewardedAd: RewardedAd | null = null;
let adLoaded = false;

export function createRewardedAd(): void {
  if (Platform.OS === 'web') return;

  rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID!, {
    requestNonPersonalizedAdsOnly: false,
  });
}

export function isRewardedAdReady(): boolean {
  if (Platform.OS === 'web') return true;
  return adLoaded;
}

export async function loadRewardedAd(): Promise<void> {
  if (Platform.OS === 'web') return;

  if (!rewardedAd) {
    createRewardedAd();
  }

  return new Promise<void>((resolve, reject) => {
    if (!rewardedAd) {
      reject(new Error('Ad not created'));
      return;
    }

    const unsubLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        adLoaded = true;
        unsubLoaded();
        resolve();
      }
    );

    const unsubError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        adLoaded = false;
        unsubError();
        reject(error);
      }
    );

    rewardedAd.load();
  });
}

export async function showRewardedAd(cb: RewardedAdCallback): Promise<AdResult> {
  if (Platform.OS === 'web') {
    await new Promise((r) => setTimeout(r, 2000));
    cb.onReward?.();
    cb.onDismiss?.();
    return 'rewarded';
  }

  if (!rewardedAd || !adLoaded) {
    cb.onError?.('Ad not ready');
    return 'not_ready';
  }

  return new Promise<AdResult>((resolve) => {
    const unsubEarned = rewardedAd!.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        cb.onReward?.();
        unsubEarned();
      }
    );

    const unsubClosed = rewardedAd!.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        adLoaded = false;
        cb.onDismiss?.();
        unsubClosed();
        createRewardedAd();
        loadRewardedAd().catch(() => {});
        resolve('rewarded');
      }
    );

    const unsubError = rewardedAd!.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        adLoaded = false;
        cb.onError?.(error.message);
        unsubError();
        resolve('error');
      }
    );

    rewardedAd!.show();
  });
}

export function resetAd(): void {
  adLoaded = false;
  createRewardedAd();
  loadRewardedAd().catch(() => {});
}
