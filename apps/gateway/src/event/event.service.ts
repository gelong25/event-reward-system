/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

/**
 * 이벤트/보상 관련 API를 내부 서비스에서 호출하는 프록시 서비스
 * http://event:3002 내부 서비스와 통신
 */
@Injectable()
export class EventService {
  constructor(private readonly httpService: HttpService) {}

  private readonly eventBaseUrl = 'http://event:3002';

  /**
   * 모든 이벤트 조회
   */
  async getAllEvents() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.eventBaseUrl}/events`),
    );
    return data;
  }
  /**
   * 이벤트 ID로 단건 조회
   * @param eventId 이벤트 ID
   */
  async getEventById(eventId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.eventBaseUrl}/events/${eventId}`),
    );
    return data;
  }
  /**
   * 이벤트 생성
   * @param eventData 생성할 이벤트 데이터
   */
  async createEvent(eventData: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.eventBaseUrl}/events`, eventData),
    );
    return data;
  }

  /**
   * 전체 보상 목록 조회
   */
  async getRewards() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.eventBaseUrl}/rewards`),
    );
    return data;
  }
  /**
   * 이벤트별 보상 목록 조회
   * @param eventId 이벤트 ID
   */
  async getRewardsByEventId(eventId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.eventBaseUrl}/rewards?eventId=${eventId}`),
    );
    return data;
  }
  /**
   * 보상 생성
   * @param rewardData 생성할 보상 데이터
   */
  async createReward(rewardData: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.eventBaseUrl}/rewards`, rewardData),
    );
    return data;
  }

  /**
   * 보상 요청 생성
   * @param userId 사용자 ID
   * @param eventId 이벤트 ID
   * @param characterId 캐릭터 ID
   * @param characterLevel 캐릭터 레벨
   */
  async requestReward(
    userId: string,
    eventId: string,
    characterId: string,
    characterLevel: number,
  ) {
    const payload = {
      userId,
      eventId,
      characterId,
      characterLevel,
    };
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.eventBaseUrl}/rewards/request`, payload),
    );
    return data;
  }
  /**
   * 보상 요청 목록 조회
   * @param filters 사용자/이벤트/캐릭터 ID 기반 필터
   */
  async getRewardRequests(
    filters: { userId?: string; eventId?: string; characterId?: string } = {},
  ) {
    let url = `${this.eventBaseUrl}/rewards/request`;

    // 필터링 조건 추가
    const queryParams = new URLSearchParams();
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.eventId) queryParams.append('eventId', filters.eventId);
    if (filters.characterId)
      queryParams.append('characterId', filters.characterId);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
  }
}
